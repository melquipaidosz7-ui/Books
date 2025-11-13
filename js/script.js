// Espera o DOM estar pronto e detecta qual página estamos
document.addEventListener('DOMContentLoaded', () => {
  // Tenta ler data-pagina primeiro
  let paginaAtual = document.body.getAttribute('data-pagina');
  
  console.log('Atributo data-pagina bruto:', paginaAtual);
  console.log('Dataset completo:', document.body.dataset);
  
  // Fallback: se não encontrou data-pagina, detecta pelo título
  if (!paginaAtual || paginaAtual.trim() === '') {
    const titulo = document.title.trim().toLowerCase();
    console.log('Fallback: detectando pela página title:', titulo);
    
    if (titulo.includes('meus livros')) {
      paginaAtual = 'todos';
    } else if (titulo.includes('lido')) {
      paginaAtual = 'lido';
    } else if (titulo.includes('lendo') || titulo.includes('andamento')) {
      paginaAtual = 'lendo';
    } else if (titulo.includes('a ler')) {
      paginaAtual = 'a-ler';
    } else {
      paginaAtual = 'todos';
    }
  }
  
  // Normaliza
  if (!paginaAtual || paginaAtual.trim() === '') {
    paginaAtual = 'todos';
  }
  
  paginaAtual = paginaAtual.trim().toLowerCase();
  console.log('Página atual (normalizada):', paginaAtual);

  // Marcar botão de navegação ativo
  const navLinks = document.querySelectorAll('header nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href').toLowerCase();
    
    // Determinar qual página este link representa
    let linkPagina = '';
    if (href.includes('index.html')) {
      linkPagina = 'todos';
    } else if (href.includes('lidos.html')) {
      linkPagina = 'lido';
    } else if (href.includes('lendo.html')) {
      linkPagina = 'lendo';
    } else if (href.includes('a-ler.html')) {
      linkPagina = 'a-ler';
    }
    
    // Adicionar classe .active se for a página atual
    if (linkPagina === paginaAtual) {
      link.classList.add('active');
      console.log('Link ativo encontrado:', link.textContent);
    } else {
      link.classList.remove('active');
    }
  });

  // Criar e mostrar indicador de página
  // (Removido conforme requisição do usuário)

  // Carrega os livros
  fetch('data/livros.json')
    .then(res => res.json())
    .then(livros => {
      const container = document.getElementById('livros-container');
      
      console.log('Página atual final:', paginaAtual);
      console.log('Livros carregados:', livros);
      
      // Se for "todos", mostra todos os livros; caso contrário, filtra por status
      let livrosFiltrados;
      if (paginaAtual === 'todos') {
        livrosFiltrados = livros;
        console.log('Modo: exibindo TODOS os livros');
      } else {
        livrosFiltrados = livros.filter(l => {
          const statusNormalizado = (l.status || '').trim().toLowerCase();
          const match = statusNormalizado === paginaAtual;
          console.log(`Livro "${l.titulo}" - status: "${statusNormalizado}" - match: ${match}`);
          return match;
        });
        console.log(`Modo: filtrando por "${paginaAtual}"`);
      }
    
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

      // efeitos de desfoque global: ao entrar no card, desfoca a página e mantém o card nítido.
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
    })
    .catch(err => console.error('Erro ao carregar livros:', err));

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
});