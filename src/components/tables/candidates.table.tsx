import { FC, useEffect, useRef, useState } from 'react';

type TableRowCandidates = Record<string, string | number>;

const CandidatesTable: FC = () => {
  const [candidates, setCandidates] = useState<TableRowCandidates[]>([]);
  const [page, setPage] = useState(1);
  const limit = 4;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);

  const loadMoreCandidates = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/candidates?_start=${(page - 1) * limit}&_end=${page * limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const newCandidates = await response.json();
      setCandidates([...candidates, ...newCandidates]);
      setHasMore(newCandidates.length > 0 && newCandidates.length >= limit);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreCandidates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    let timer: number | undefined;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        timer = setTimeout(loadMoreCandidates, 2000);
      }
    });

    if (lastRowRef.current) observer.current.observe(lastRowRef.current);

    return () => clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  return (


    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 rounded-md">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Applied Position
            </th>
            <th scope="col" className="px-6 py-3">
              Experience(Years)
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((row, index) => (
            <tr
              key={index}
              ref={index === candidates.length - 1 ? lastRowRef : null}
              className="bg-white border-b"
            >
              {Object.keys(row).map((key) => (
                <td
                  key={key}
                  className={`
                    px-6 py-4 
                    ${key === 'name' || key === 'position_applied' || key === 'status' ? 'font-bold' : ''} 
                    ${key === 'status' && row[key] === 'interviewed' ? 'text-blue-500' : ''}
                    ${key === 'experience_years' && row[key] as number > 3 ? 'text-green-500 font-bold' : ''}
                    `}
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
          {loading && (
            <tr>
              <td colSpan={5} className="text-center">Loading...</td>
            </tr>
          )}

        </tbody>
      </table>
    </div>
  );
};

export { CandidatesTable };
