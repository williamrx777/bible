import React, { useEffect, useState } from 'react';
import { Spinner, Row, Col } from 'react-bootstrap';

export default function ChapterList({ bookId, onSelectChapter }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    
    setLoading(true);
    fetch(`https://bible-api-alpha.vercel.app/chapters?bookId=${bookId}`)
      .then(res => res.json())
      .then(data => {
        setChapters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar capítulos:', err);
        setLoading(false);
      });
  }, [bookId]);

  return (
    <div>
      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="info" />
          <p className="mt-2 text-muted">Carregando capítulos...</p>
        </div>
      ) : (
        <Row xs={4} md={5} lg={6} className="g-3">
          {chapters.map(ch => (
            <Col key={ch.id}>
              <div 
                className="chapter-btn text-center p-3 bg-white border rounded shadow-sm"
                onClick={() => onSelectChapter(ch)}
                style={{ cursor: 'pointer' }}
              >
                {ch.number}
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}