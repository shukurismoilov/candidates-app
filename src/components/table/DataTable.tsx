import React, { useEffect, useRef, useState } from 'react';
import './DataTable.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableRowData = Record<string, any>;

const DataTable: React.FC = () => {
  const [data, setData] = useState<TableRowData[]>([]);
  const [dataIds, setDataIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 4;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);

  const loadMoreData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/candidates?_start=${(page - 1) * limit}&_end=${page * limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const newData = await response.json();
      setDataIds([...dataIds, ...newData.map((row: TableRowData) => row.id)]);

      setData([...data, ...newData]);
      setHasMore(newData.length > 0 && newData.length >= limit);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    let timer: number | undefined;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        timer = setTimeout(loadMoreData, 2000);
      }
    });

    if (lastRowRef.current) observer.current.observe(lastRowRef.current);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {data[0] && Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              ref={index === data.length - 1 ? lastRowRef : null}
            >
              {Object.keys(row).map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
          {loading && (
            <tr>
              <td colSpan={5} className="loading">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export { DataTable };
