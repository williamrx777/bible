import React, { useState } from "react";
import VerseList from "./Verse";
import BookList from "./Book";
import ChapterList from "./ChapterList";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import './Home.css';

export default function Home() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null); // Novo estado para versículo selecionado
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Função para realizar a busca
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
  
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error('Erro ao buscar:', error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  

  // Função para limpar a busca
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  // Função para selecionar um resultado da busca
  const handleSelectSearchResult = (verse) => {
    // Criar objetos compatíveis com nossa estrutura existente
    const book = { id: verse.book_id, name: verse.book };
    const chapter = { id: verse.chapter_id, number: verse.chapter };
    
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setSelectedVerse(verse.verse); // Armazenar o número do versículo para destacar
    clearSearch();
  };

  const handleSelectBook = (book) => {
    setHistory([...history, 'books']);
    setSelectedBook(book);
    setSelectedChapter(null);
    setSelectedVerse(null); // Resetar versículo selecionado
    clearSearch();
  };

  const handleSelectChapter = (chapter) => {
    setHistory([...history, 'chapters']);
    setSelectedChapter(chapter);
    setSelectedVerse(null); // Resetar versículo selecionado
    clearSearch();
  };

  const handleBack = () => {
    if (history.length === 0) return;
    
    const newHistory = [...history];
    const prevStep = newHistory.pop();
    setHistory(newHistory);
    
    if (prevStep === 'chapters') {
      setSelectedChapter(null);
    } else if (prevStep === 'books') {
      setSelectedBook(null);
    }
    
    setSelectedVerse(null); // Resetar versículo selecionado
    clearSearch();
  };

  const getHeaderTitle = () => {
    if (searchQuery) return `Busca: "${searchQuery}"`;
    if (selectedVerse) return `${selectedBook.name} ${selectedChapter.number}:${selectedVerse}`;
    if (selectedChapter) return `${selectedBook.name} ${selectedChapter.number}`;
    if (selectedBook) return `Capítulos de ${selectedBook.name}`;
    return "Livros";
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-primary text-white shadow-sm">
        <Container fluid>
          <Row className="py-3 align-items-center">
            <Col xs="auto">
              <div className="bg-white rounded-circle p-1">
                <div className="bg-primary rounded-circle" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="fw-bold">B</span>
                </div>
              </div>
            </Col>
            <Col>
              <h1 className="h4 mb-0">Bíblia Sagrada</h1>
              <p className="small mb-0">Leitura e estudo da Palavra de Deus</p>
              <p className="small mb-0">
                &quot;Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a instrução na justiça, para que o homem de Deus seja apto e plenamente preparado para toda boa obra.&quot;
                <br />
                <cite className="small">2 Timóteo 3:16-17</cite>
              </p>
            </Col>
          </Row>
          
          {/* Barra de Busca */}
          <Row className="mt-3">
            <Col>
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleSearch(searchQuery);
              }}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar versículos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button variant="outline-light" onClick={clearSearch}>
                      Limpar
                    </Button>
                  )}
                  <Button variant="light" type="submit">
                    Buscar
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </header>
      
      {/* Conteúdo Principal */}
      <Container fluid className="py-4 flex-grow-1">
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white py-3 d-flex align-items-center">
            {(history.length > 0 || searchQuery) && (
              <Button 
                variant="light" 
                className="me-3"
                onClick={handleBack}
              >
                &larr; Voltar
              </Button>
            )}
            <Card.Title className="mb-0 fw-bold">{getHeaderTitle()}</Card.Title>
          </Card.Header>
          
          <Card.Body>
            <Row className="justify-content-center">
              <Col lg={10}>
                {/* Exibir resultados da busca */}
                {searchQuery ? (
                  <>
                    {isSearching ? (
                      <div className="text-center p-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Buscando versículos...</p>
                      </div>
                    ) : searchError ? (
                      <div className="text-center p-5 text-danger">
                        <p>Ocorreu um erro na busca: {searchError}</p>
                        <Button variant="primary" onClick={() => handleSearch(searchQuery)}>
                          Tentar novamente
                        </Button>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="search-results">
                        <p className="text-muted mb-3">{searchResults.length} resultado(s) encontrado(s)</p>
                        {searchResults.map((verse) => (
                          <div 
                            key={verse.id} 
                            className="mb-4 border-bottom pb-3 search-result-item"
                            onClick={() => handleSelectSearchResult(verse)}
                          >
                            <h5 className="d-flex align-items-center">
                              <span className="badge bg-primary me-2">
                                {verse.book} {verse.chapter}:{verse.verse}
                              </span>
                              <span className="text-muted small">{verse.book} {verse.chapter}</span>
                            </h5>
                            <p className="mb-0">{verse.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-5">
                        <p className="text-muted">Nenhum versículo encontrado para "{searchQuery}"</p>
                        <Button variant="primary" onClick={clearSearch}>
                          Limpar busca
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Conteúdo normal (livros, capítulos, versículos) */
                  <>
                    {!selectedBook && !selectedChapter && (
                      <BookList onSelectBook={handleSelectBook} />
                    )}
                    
                    {selectedBook && !selectedChapter && (
                      <ChapterList 
                        bookId={selectedBook.id} 
                        onSelectChapter={handleSelectChapter}
                      />
                    )}
                    
                    {selectedChapter && (
                      <VerseList 
                        chapterId={selectedChapter.id} 
                        highlightVerse={selectedVerse} 
                      />
                    )}
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <p className="mb-1">&copy; {new Date().getFullYear()} Bíblia Online</p>
              <p className="mb-0">Gloria a Deus</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="mb-1">Desenvolvido por <a href="https://github.com/williamverhaeghe" target="_blank" rel="noopener noreferrer" className="text-white">William</a></p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}