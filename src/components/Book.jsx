import React, { useEffect, useState } from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap'; // Adicionei Row e Col

export default function BookList({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar livros:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Carregando livros...</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {books.map(book => (
            <Col key={book.id}>
              <Card 
                className="h-100 shadow-sm chapter-btn"
                onClick={() => onSelectBook(book)}
              >
                <Card.Body className="text-center d-flex flex-column justify-content-center">
                  <Card.Title>{book.name}</Card.Title>
                  <Card.Subtitle className="text-muted mt-2">
                    {book.testament}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}