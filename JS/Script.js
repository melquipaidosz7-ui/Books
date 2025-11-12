// Detecta qual página estamos
const paginaAtual = document.title.toLowerCase().includes("meus livros") ? "todos" :
                    document.title.toLowerCase().includes("lidos") ? "lido" :
                    document.title.toLowerCase().includes("lendo") ? "lendo" :
                    document.title.toLowerCase().includes("a ler") ? "a-ler" :
                    "todos";

// Carrega os livros
fetch('Data/Livros.json')
  .then(res => res.json())
  .then(livros => {
    const container = document.getElementById('livros-container');
    
    console.log('Página atual:', paginaAtual);
    console.log('Livros carregados:', livros);
    
    // Se for "todos", mostra todos os livros; caso contrário, filtra por status
    const livrosFiltrados = paginaAtual === "todos" 
      ? livros 
      : livros.filter(l => l.status === paginaAtual);
    
    console.log('Livros a exibir:', livrosFiltrados);
    
    livrosFiltrados.forEach(livro => {
      const card = document.createElement('div');
      card.className = 'card';
      card.tabIndex = 0; // acessibilidade

      card.innerHTML = `
        <img src="${livro.capa}" alt="Capa de ${livro.titulo}">
        <div class="card-info">
          <h3>${livro.titulo}</h3>
          <p><strong>${livro.autor}</strong></p>
          <p>${livro.paginas} páginas</p>
        </div>
        <div class="resumo">
          <p>${livro.resumo}</p>
        </div>
      `;
      container.appendChild(card);

      // efeitos de desfoque global: ao entrar no card, desfoca a página e mantém o card nítido
      const onEnter = () => {
        document.body.classList.add('page-blur');
        card.classList.add('no-blur');
      };
      const onLeave = () => {
        document.body.classList.remove('page-blur');
        card.classList.remove('no-blur');
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('focus', onEnter);
      card.addEventListener('blur', onLeave);

      // para dispositivos touch: mostra no touchstart e remove após touchend
      card.addEventListener('touchstart', (e) => { onEnter(); }, {passive: true});
      card.addEventListener('touchend', (e) => { onLeave(); });
    });
  });

// Modo escuro
const toggle = document.getElementById('theme-toggle');
const body = document.body;

const temaAtual = localStorage.getItem('tema');
if (temaAtual === 'dark') {
  body.classList.add('dark');
  toggle.textContent = '☀️';
}

toggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  toggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('tema', isDark ? 'dark' : 'light');
});