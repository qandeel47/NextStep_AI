async function initializeCounselor() {
  if (state.counselorStatus === 'loading') return;
  state.counselorStatus = 'loading';
  state.counselorError = '';
  render();
  try {
    const conversations = await apiLoadCounselorConversations();
    if (conversations.length && !state.counselorNewChat && !state.counselorSending) {
      await openCounselorConversation(conversations[0].id, false);
    }
    state.counselorStatus = 'ready';
  } catch (err) {
    state.counselorStatus = 'error';
    state.counselorError = err.message || 'Could not load counselor conversations.';
  }
  render();
}

async function openCounselorConversation(conversationId, shouldRender = true) {
  if (state.counselorSending) return;
  state.counselorNewChat = false;
  state.counselorConversationId = conversationId;
  state.counselorThoughts = '';
  state.counselorStreamText = '';
  state.counselorStatus = 'loading';
  if (shouldRender) render();
  try {
    state.counselorMessages = await apiLoadCounselorMessages(conversationId);
    state.counselorStatus = 'ready';
    state.counselorError = '';
  } catch (err) {
    state.counselorStatus = 'error';
    state.counselorError = err.message || 'Could not load this conversation.';
  }
  if (shouldRender) renderCounselorAndScroll();
}

function newCounselorConversation() {
  if (state.counselorSending) return;
  state.counselorNewChat = true;
  state.counselorConversationId = '';
  state.counselorMessages = [];
  state.counselorThoughts = '';
  state.counselorStreamText = '';
  state.counselorStatus = 'ready';
  state.counselorError = '';
  state.counselorDraft = '';
  render();
}

async function deleteCounselorConversation() {
  const conversationId = state.counselorConversationId;
  if (!conversationId || state.counselorSending || !window.confirm('Delete this conversation?')) return;
  try {
    await apiDeleteCounselorConversation(conversationId);
    state.counselorConversationId = '';
    state.counselorMessages = [];
    state.counselorThoughts = '';
    state.counselorStreamText = '';
    const conversations = await apiLoadCounselorConversations();
    if (conversations.length) {
      await openCounselorConversation(conversations[0].id, false);
    } else {
      state.counselorNewChat = true;
    }
    state.counselorStatus = 'ready';
    render();
  } catch (err) {
    toast(err.message || 'Could not delete conversation');
  }
}

function useCounselorSuggestion(text) {
  state.counselorDraft = text;
  const input = document.getElementById('counselor-input');
  if (!input) return;
  input.value = text;
  input.focus();
}

function onCounselorDraftInput(event) {
  state.counselorDraft = event.target.value;
}

function onCounselorComposeKeydown(event) {
  if (event.key !== 'Enter' || event.shiftKey) return;
  event.preventDefault();
  sendCounselorMessage(event);
}

function updateCounselorLive() {
  const thoughtEl = document.getElementById('counselor-thought-body');
  if (thoughtEl) {
    thoughtEl.textContent = state.counselorThoughts || 'Reading your question and profile…';
  }
  const streamEl = document.getElementById('counselor-stream-body');
  if (streamEl && state.counselorStreamText) {
    streamEl.classList.remove('chat-typing');
    streamEl.innerHTML = esc(state.counselorStreamText).replace(/\n/g, '<br>');
  }
  const messages = document.getElementById('counselor-messages');
  if (messages) messages.scrollTop = messages.scrollHeight;
}

async function sendCounselorMessage(event) {
  event.preventDefault();
  if (state.counselorSending) return;
  const input = document.getElementById('counselor-input');
  const message = String((input && input.value) || state.counselorDraft || '').trim();
  if (message.length < 2) {
    toast('Please enter a complete question');
    return;
  }

  state.counselorSending = true;
  state.counselorDraft = '';
  state.counselorError = '';
  state.counselorThoughts = '';
  state.counselorStreamText = '';
  const temporaryMessage = {
    id: `pending-${Date.now()}`,
    role: 'user',
    content: message,
    created_at: new Date().toISOString(),
  };
  state.counselorMessages.push(temporaryMessage);
  renderCounselorAndScroll();

  try {
    if (!state.counselorConversationId) {
      const conversation = await apiCreateCounselorConversation();
      state.counselorConversationId = conversation.id;
      state.counselorNewChat = false;
    }
    const reply = await apiStreamCounselorMessage(
      state.counselorConversationId,
      message,
      (eventData) => {
        if (eventData.type === 'thought') {
          state.counselorThoughts += eventData.text || '';
        } else if (eventData.type === 'text') {
          state.counselorStreamText += eventData.text || '';
        }
        updateCounselorLive();
      },
    );
    reply.thoughts = state.counselorThoughts;
    state.counselorMessages = state.counselorMessages.filter(
      (item) => item.id !== temporaryMessage.id,
    );
    state.counselorMessages.push({
      id: `user-${reply.id}`,
      role: 'user',
      content: message,
      created_at: reply.created_at,
    });
    state.counselorMessages.push(reply);
    await apiLoadCounselorConversations();
    state.counselorStatus = 'ready';
  } catch (err) {
    state.counselorMessages = state.counselorMessages.filter(
      (item) => item.id !== temporaryMessage.id,
    );
    state.counselorDraft = message;
    state.counselorError = err.message || 'The counselor could not respond.';
    toast(state.counselorError);
  } finally {
    state.counselorSending = false;
    state.counselorStreamText = '';
    renderCounselorAndScroll();
  }
}

function renderCounselorAndScroll() {
  render();
  window.requestAnimationFrame(() => {
    const messages = document.getElementById('counselor-messages');
    if (messages) messages.scrollTop = messages.scrollHeight;
    const input = document.getElementById('counselor-input');
    if (input && !state.counselorSending) {
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  });
}

function counselorThoughtHtml(thoughts, open) {
  if (!thoughts && !open) return '';
  return `<details class="chat-thought" ${open ? 'open' : ''}>
    <summary>${open ? 'Thinking' : 'Thought process'}</summary>
    <div class="chat-thought-body" id="${open ? 'counselor-thought-body' : ''}">${esc(thoughts || 'Reading your question and profile…')}</div>
  </details>`;
}

function counselorMessageHtml(message) {
  const content = esc(message.content).replace(/\n/g, '<br>');
  const assistant = message.role === 'assistant';
  const thoughts = assistant ? counselorThoughtHtml(message.thoughts || '', false) : '';
  return `<div class="chat-message ${assistant ? 'assistant' : 'user'}">
    <div class="chat-avatar${assistant ? ' chat-avatar-ai' : ''}">${assistant ? aiChatIcon() : 'You'}</div>
    <div class="chat-stack">
      ${thoughts}
      <div class="chat-bubble">${content}</div>
    </div>
  </div>`;
}

function pageCounselor() {
  if (state.counselorStatus === 'idle') {
    initializeCounselor();
    return '<div class="card">Loading AI counselor…</div>';
  }

  const activeId = state.counselorConversationId;
  const messages = state.counselorMessages;
  const suggestions = [
    'What careers match my marks and interests?',
    'Mere top career ke liye step-by-step roadmap banao.',
    'Which universities and scholarships fit my profile?',
  ];

  return `<div class="counselor-layout">
    <aside class="chat-history card">
      <button class="btn btn-primary btn-block" onclick="newCounselorConversation()">＋ New chat</button>
      <div class="chat-history-list">
        ${state.counselorConversations.length
          ? state.counselorConversations.map((conversation) => `
            <button class="chat-history-item ${conversation.id === activeId ? 'active' : ''}"
              onclick="openCounselorConversation('${conversation.id}')">
              <strong>${esc(conversation.title)}</strong>
              <span>${conversation.message_count} messages</span>
            </button>`).join('')
          : '<p class="helper" style="padding:14px 4px;">Your conversations will appear here.</p>'}
      </div>
    </aside>

    <section class="chat-panel card">
      <div class="chat-panel-head">
        <div>
          <h3>NextStep AI Counselor</h3>
          <p>Personalized guidance from your profile and recommendations</p>
        </div>
        ${activeId ? '<button class="btn btn-ghost btn-sm" onclick="deleteCounselorConversation()">Delete</button>' : ''}
      </div>

      <div class="chat-messages" id="counselor-messages">
        ${messages.length
          ? messages.map(counselorMessageHtml).join('')
          : `<div class="chat-welcome">
              <div class="chat-welcome-icon">${aiChatIcon()}</div>
              <h3>How can I guide you?</h3>
              <p>I can explain career matches, build a roadmap, and help you explore universities or scholarships.</p>
              <div class="chat-suggestions">
                ${suggestions.map((text) => `<button onclick="useCounselorSuggestion('${text.replace(/'/g, "\\'")}')">${esc(text)}</button>`).join('')}
              </div>
            </div>`}
        ${state.counselorSending
          ? `<div class="chat-message assistant">
              <div class="chat-avatar chat-avatar-ai">${aiChatIcon()}</div>
              <div class="chat-stack">
                ${counselorThoughtHtml(state.counselorThoughts, true)}
                ${state.counselorStreamText
                  ? `<div class="chat-bubble" id="counselor-stream-body">${esc(state.counselorStreamText).replace(/\n/g, '<br>')}</div>`
                  : '<div class="chat-bubble chat-typing" id="counselor-stream-body">Preparing an answer…</div>'}
              </div>
            </div>`
          : ''}
      </div>

      ${state.counselorError ? `<p class="chat-error">${esc(state.counselorError)}</p>` : ''}
      <form class="chat-compose" onsubmit="sendCounselorMessage(event)">
        <textarea id="counselor-input" maxlength="2000" rows="1"
          placeholder="Ask in English, Urdu, or Roman Urdu…"
          oninput="onCounselorDraftInput(event)"
          onkeydown="onCounselorComposeKeydown(event)"
          ${state.counselorSending ? 'disabled' : ''}>${esc(state.counselorDraft || '')}</textarea>
        <button class="btn btn-primary chat-send" type="submit" ${state.counselorSending ? 'disabled' : ''}>Send</button>
      </form>
      <p class="chat-disclaimer">AI guidance can be imperfect. Verify admissions and deadlines on official websites.</p>
    </section>
  </div>`;
}
