import { FC, useState } from 'react';
import { AddCandidateModal } from './components/modals/add-candidate.modal';
import { CandidatesTable } from './components/tables/candidates.table';

const App: FC = () => {

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div className="py-8 px-4">
      <div className="flex mb-4 items-center">
        <h1 className="text-2xl font-bold mb-4">Candidates</h1>
        <button
          className=" ml-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 text-white font-bold py-2 px-4 rounded"
          onClick={handleOpenModal}
        >
          Add candidate
        </button>
      </div>
      <CandidatesTable />
      <AddCandidateModal open={openModal} onClose={handleCloseModal} />
    </div>
  );
}

export { App };
