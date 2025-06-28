import React, { useEffect, useState, useRef } from 'react';
import { Spinner } from 'react-bootstrap';

export default function VerseList({ chapterId, highlightVerse }) {
  const [verses, setVerses] = useState([]);
  const [bookName, setBookName] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const highlightedRef = useRef(null);

  useEffect(() => {
    if (!chapterId) return;

    setLoading(true);
    fetch(`https://bible-api-alpha.vercel.app/verses?chapterId=${chapterId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setVerses(data);
        if (data.length > 0) {
          setBookName(data[0].book);
          setChapterNumber(data[0].chapter);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar versículos:', err);
        setVerses([]);
        setLoading(false);
      });
  }, [chapterId]);

  // Rola até o versículo destacado
  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [verses, highlightVerse]);

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          {bookName} {chapterNumber && `Capítulo ${chapterNumber}`}
        </h2>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="dark" />
          <p className="mt-3 text-muted">Carregando versículos...</p>
        </div>
      ) : verses.length > 0 ? (
        <div className="verse-container p-4 bg-light rounded shadow-sm">
          {verses.map((verse) => {
            const [verseNumber, ...rest] = verse.verse.split('. ');
            const text = rest.join('. ') || verse.verse;
            const isHighlighted = highlightVerse && verseNumber === highlightVerse.toString();

            return (
              <div
                key={verse.id}
                ref={isHighlighted ? highlightedRef : null}
                className={`verse-text position-relative mb-4 ${
                  isHighlighted ? 'highlighted-verse' : ''
                }`}
                aria-label={`Versículo ${verseNumber}`}
              >
                <span className="verse-number fw-bold">{verseNumber}</span>
                <span className="ms-3">{text}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-5">
          <i className="bi bi-book" style={{ fontSize: '3rem', color: '#e9ecef' }}></i>
          <p className="text-muted mt-3">Nenhum versículo encontrado</p>
        </div>
      )}
    </div>
  );
}
