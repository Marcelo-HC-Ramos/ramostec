/**
 * Ramostec – Nav Module
 * Injeta a navegação dinâmica em todas as páginas.
 * Chame Nav.render('pagina-atual') no <body>.
 */

const Nav = (() => {
  const CSS = `
    <style id="nav-styles">
      .rmt-nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
        background: rgba(255,255,255,0.97); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 2rem; height: 64px;
        border-bottom: 2px solid #E2E8F0;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      }
      .rmt-nav-logo {
        font-family: 'Barlow Condensed', 'Barlow', sans-serif;
        font-size: 1.7rem; font-weight: 900;
        color: #CC0000; letter-spacing: -0.5px; text-decoration: none;
      }
      .rmt-nav-logo span { color: #CC0000; }
      .rmt-nav-links { display: flex; gap: 0.25rem; list-style: none; align-items: center; }
      .rmt-nav-links a {
        color: #2D2D2D; text-decoration: none; font-weight: 500; font-size: 0.9rem;
        padding: 0.5rem 1rem; border-radius: 6px; transition: all 0.2s;
        font-family: 'Barlow', sans-serif;
      }
      .rmt-nav-links a:hover { color: #CC0000; background: rgba(255,255,255,0.97); }
      .rmt-nav-links a.active { color: #CC0000; font-weight: 700; background: rgba(255,255,255,0.97); }
      .rmt-nav-links a.nav-cta {
        background: #CC0000; color: white !important; font-weight: 700;
        padding: 0.5rem 1.1rem; border-radius: 6px;
      }
      .rmt-nav-links a.nav-cta:hover { background: #AA0000; }
      .rmt-nav-links a.nav-admin {
        background: #0F2060; color: white !important; font-weight: 700;
        padding: 0.5rem 1.1rem; border-radius: 6px;
      }
      .rmt-nav-links a.nav-admin:hover { background: #1561C8; }

      /* User chip */
      .nav-user-chip {
        display: flex; align-items: center; gap: 0.5rem;
        padding: 0.35rem 0.9rem 0.35rem 0.4rem;
        border-radius: 20px; border: 1.5px solid #E2E8F0;
        background: #F5F7FA; cursor: pointer; position: relative;
        font-family: 'Barlow', sans-serif;
      }
      .nav-user-chip:hover { border-color: #CC0000; }
      .nav-user-avatar {
        width: 28px; height: 28px; border-radius: 50%;
        background: #CC0000; color: white;
        font-size: 0.75rem; font-weight: 900;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .nav-user-avatar.admin-av { background: #0F2060; }
      .nav-user-name { font-size: 0.82rem; font-weight: 600; color: #2D2D2D; }
      .nav-user-role { font-size: 0.7rem; color: #6B7A8D; }

      /* Dropdown */
      .nav-dropdown {
        position: absolute; top: calc(100% + 8px); right: 0;
        background: white; border: 1px solid #E2E8F0; border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        min-width: 180px; padding: 0.5rem;
        display: none; z-index: 2000;
      }
      .nav-dropdown.open { display: block; }
      .nav-dropdown a, .nav-dropdown button {
        display: flex; align-items: center; gap: 0.6rem;
        width: 100%; padding: 0.6rem 0.8rem; border-radius: 6px;
        font-size: 0.85rem; font-weight: 600; color: #2D2D2D;
        text-decoration: none; background: none; border: none; cursor: pointer;
        font-family: 'Barlow', sans-serif; transition: all 0.15s;
        text-align: left;
      }
      .nav-dropdown a:hover, .nav-dropdown button:hover { background: #F5F7FA; color: #CC0000; }
      .nav-dropdown .dd-divider { border: none; border-top: 1px solid #E2E8F0; margin: 0.3rem 0; }
      .nav-dropdown .dd-logout { color: #CC0000 !important; }
      .nav-dropdown .dd-logout:hover { background: rgba(220,38,38,0.07) !important; color: #CC0000 !important; }
      .nav-dropdown .dd-header { padding: 0.4rem 0.8rem 0.6rem; }
      .nav-dropdown .dd-header strong { display: block; font-size: 0.85rem; color: #1A1A1A; }
      .nav-dropdown .dd-header span { font-size: 0.75rem; color: #6B7A8D; }
      .nav-dropdown .dd-badge {
        margin-left: auto; font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
        padding: 0.15rem 0.5rem; border-radius: 20px; letter-spacing: 0.5px;
      }
      .dd-badge-admin { background: rgba(15,32,96,0.12); color: #0F2060; }
      .dd-badge-user { background: rgba(204,0,0,0.1); color: #CC0000; }

      /* Hamburger */
      .rmt-hamburger { display: none; cursor: pointer; flex-direction: column; gap: 5px; background: none; border: none; padding: 4px; }
      .rmt-hamburger span { display: block; width: 24px; height: 2px; background: #2D2D2D; transition: all 0.3s; }
      .rmt-mobile-menu {
        display: none; position: fixed; top: 64px; left: 0; right: 0;
        background: #CC0000; z-index: 999;
        flex-direction: column; padding: 1rem;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }
      .rmt-mobile-menu.open { display: flex; }
      .rmt-mobile-menu a, .rmt-mobile-menu button {
        color: rgba(255,255,255,0.9); text-decoration: none;
        padding: 0.9rem 1rem; border-radius: 8px; font-weight: 600;
        transition: all 0.2s; font-family: 'Barlow', sans-serif;
        background: none; border: none; font-size: 1rem; text-align: left; cursor: pointer;
      }
      .rmt-mobile-menu a:hover, .rmt-mobile-menu button:hover { background: rgba(255,255,255,0.1); }
      .rmt-mobile-menu .mob-divider { border: none; border-top: 1px solid rgba(255,255,255,0.2); margin: 0.4rem 0; }
      .rmt-mobile-menu .mob-logout { color: rgba(255,200,200,0.9) !important; }

      @media (max-width: 768px) {
        .rmt-nav-links { display: none; }
        .rmt-hamburger { display: flex; }
      }
    </style>
  `;

  function _initial(name) {
    return (name || 'U')[0].toUpperCase();
  }

  function render(activePage) {
    const session = Auth.getSession();
    const isLoggedIn = !!session;
    const isAdmin = session && session.role === 'admin';

    // Build nav links
    let links = `
      <li><a href="index.html" ${activePage === 'home' ? 'class="active"' : ''}>Início</a></li>
      <li><a href="loja.html" ${activePage === 'loja' ? 'class="active"' : ''}>Loja de Peças</a></li>
    `;

    if (isLoggedIn) {
      links += `<li><a href="contato.html" class="nav-cta ${activePage === 'contato' ? 'active' : ''}">🔧 Solicitar Atendimento</a></li>`;
      if (isAdmin) {
        links += `<li><a href="admin.html" class="nav-admin ${activePage === 'admin' ? 'active' : ''}">⚙️ Admin</a></li>`;
      }
      // User chip with dropdown
      const avatarClass = isAdmin ? 'nav-user-avatar admin-av' : 'nav-user-avatar';
      const badge = isAdmin
        ? '<span class="dd-badge dd-badge-admin">Admin</span>'
        : '<span class="dd-badge dd-badge-user">Usuário</span>';
      links += `
        <li>
          <div class="nav-user-chip" onclick="Nav.toggleDropdown()" id="navUserChip">
            <div class="${avatarClass}">${_initial(session.nome)}</div>
            <div>
              <div class="nav-user-name">${session.nome.split(' ')[0]}</div>
              <div class="nav-user-role">${isAdmin ? 'Administrador' : 'Minha conta'}</div>
            </div>
            <div class="nav-dropdown" id="navDropdown">
              <div class="dd-header">
                <strong>${session.nome}</strong>
                <span>${session.email}</span>
              </div>
              <hr class="dd-divider">
              <a href="minha-conta.html">👤 Minha Conta ${badge}</a>
              ${isAdmin ? '<a href="admin.html">⚙️ Painel Admin</a>' : ''}
              <hr class="dd-divider">
              <button class="dd-logout" onclick="Auth.logout()">🚪 Sair</button>
            </div>
          </div>
        </li>
      `;
    } else {
      links += `<li><a href="login.html" ${activePage === 'login' ? 'class="active"' : ''}>Entrar</a></li>`;
      links += `<li><a href="login.html?tab=cadastro" class="nav-cta">Cadastrar</a></li>`;
    }

    // Mobile menu
    let mobileLinks = `
      <a href="index.html">🏠 Início</a>
      <a href="loja.html">🛒 Loja de Peças</a>
    `;
    if (isLoggedIn) {
      mobileLinks += `<a href="contato.html">🔧 Solicitar Atendimento</a>`;
      mobileLinks += `<a href="minha-conta.html">👤 Minha Conta</a>`;
      if (isAdmin) mobileLinks += `<a href="admin.html">⚙️ Painel Admin</a>`;
      mobileLinks += `<hr class="mob-divider"><button class="mob-logout" onclick="Auth.logout()">🚪 Sair</button>`;
    } else {
      mobileLinks += `<hr class="mob-divider"><a href="login.html">🔑 Entrar</a><a href="login.html?tab=cadastro">✏️ Cadastrar</a>`;
    }

    const html = `
      ${CSS}
      <nav class="rmt-nav" id="rmtNav">
        <a href="index.html" class="rmt-nav-logo">RAMOS<span>TEC</span></a>
        <ul class="rmt-nav-links">${links}</ul>
        <button class="rmt-hamburger" onclick="Nav.toggleMobile()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div class="rmt-mobile-menu" id="rmtMobileMenu">${mobileLinks}</div>
      <div style="height:64px"></div>
    `;

    document.write(html);

    // Close dropdown on outside click
    document.addEventListener('click', e => {
      const chip = document.getElementById('navUserChip');
      if (chip && !chip.contains(e.target)) {
        document.getElementById('navDropdown')?.classList.remove('open');
      }
      const mob = document.getElementById('rmtMobileMenu');
      const ham = document.querySelector('.rmt-hamburger');
      if (mob && ham && !mob.contains(e.target) && !ham.contains(e.target)) {
        mob.classList.remove('open');
      }
    });
  }

  function toggleDropdown() {
    document.getElementById('navDropdown')?.classList.toggle('open');
  }

  function toggleMobile() {
    document.getElementById('rmtMobileMenu')?.classList.toggle('open');
  }

  return { render, toggleDropdown, toggleMobile };
})();
