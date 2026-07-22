/**
 * Ramostec – Auth Module
 * Gerencia usuários, sessão e permissões via localStorage.
 * Em produção, substitua por um backend real com JWT.
 */

const Auth = (() => {
  const USERS_KEY  = 'rmt_users';
  const SESSION_KEY = 'rmt_session';

  // ── Usuários padrão (criados na primeira execução) ──
  const DEFAULT_USERS = [
    {
      id: 1,
      nome: 'Administrador',
      email: 'admin@ramostec.com',
      senha: 'admin123',
      role: 'admin',
      criadoEm: '2025-01-01'
    },
    {
      id: 2,
      nome: 'Cliente Demo',
      email: 'cliente@email.com',
      senha: 'cliente123',
      role: 'user',
      criadoEm: '2025-01-01'
    }
  ];

  function _getUsers() {
    try {
      const u = JSON.parse(localStorage.getItem(USERS_KEY));
      if (!u || !u.length) { _setUsers(DEFAULT_USERS); return DEFAULT_USERS; }
      return u;
    } catch { _setUsers(DEFAULT_USERS); return DEFAULT_USERS; }
  }

  function _setUsers(arr) {
    localStorage.setItem(USERS_KEY, JSON.stringify(arr));
  }

  function _getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
  }

  function _setSession(user) {
    const s = { id: user.id, nome: user.nome, email: user.email, role: user.role };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  }

  // ── API pública ──
  return {

    /** Retorna o usuário da sessão atual ou null */
    getSession() { return _getSession(); },

    /** true se há alguém logado */
    isLoggedIn() { return !!_getSession(); },

    /** true se logado E admin */
    isAdmin() { const s = _getSession(); return s && s.role === 'admin'; },

    /** true se logado E usuário comum */
    isUser() { const s = _getSession(); return s && s.role === 'user'; },

    /**
     * Tenta fazer login. Retorna { ok, user, error }
     */
    login(email, senha) {
      const users = _getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);
      if (!user) return { ok: false, error: 'E-mail ou senha incorretos.' };
      _setSession(user);
      return { ok: true, user };
    },

    /** Faz logout e redireciona */
    logout(redirect = 'index.html') {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.href = redirect;
    },

    /**
     * Cadastra novo usuário. Retorna { ok, error }
     */
    register(nome, email, senha) {
      if (!nome || !email || !senha) return { ok: false, error: 'Preencha todos os campos.' };
      if (senha.length < 6) return { ok: false, error: 'A senha deve ter pelo menos 6 caracteres.' };
      const users = _getUsers();
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: 'Este e-mail já está cadastrado.' };
      }
      const newUser = {
        id: Date.now(),
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        role: 'user',
        criadoEm: new Date().toISOString().slice(0, 10)
      };
      users.push(newUser);
      _setUsers(users);
      _setSession(newUser);
      return { ok: true, user: newUser };
    },

    /** Lista todos os usuários (admin only) */
    getAllUsers() { return _getUsers(); },

    /** Atualiza role de um usuário (admin only) */
    setUserRole(id, role) {
      const users = _getUsers();
      const i = users.findIndex(u => u.id === id);
      if (i > -1) { users[i].role = role; _setUsers(users); return true; }
      return false;
    },

    /** Remove usuário (admin only) */
    deleteUser(id) {
      const s = _getSession();
      if (s && s.id === id) return false; // não pode deletar a si mesmo
      _setUsers(_getUsers().filter(u => u.id !== id));
      return true;
    },

    /**
     * Redireciona para login se não estiver logado.
     * @param {string} redirect - URL para voltar após login
     */
    requireLogin(redirect) {
      if (!this.isLoggedIn()) {
        const back = redirect || window.location.href;
        window.location.href = `login.html?next=${encodeURIComponent(back)}`;
        return false;
      }
      return true;
    },

    /**
     * Redireciona para index se não for admin.
     */
    requireAdmin() {
      if (!this.isAdmin()) {
        window.location.href = 'index.html';
        return false;
      }
      return true;
    }
  };
})();
