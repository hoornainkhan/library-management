import api from './api';

export const borrowBook = async (bookId) => {
  const response = await api.post('/borrowing/borrow', { bookId });
  return response.data;
};

export const returnBook = async (borrowingId) => {
  const response = await api.put(`/borrowing/return/${borrowingId}`);
  return response.data;
};

export const getMyBorrowings = async () => {
  const response = await api.get('/borrowing/my-borrowings');
  return response.data;
};

export const getAllBorrowings = async () => {
  const response = await api.get('/borrowing/all');
  return response.data;
};

export const getActiveBorrowings = async () => {
  const response = await api.get('/borrowing/active');
  return response.data;
};

export const getOverdueBooks = async () => {
  const response = await api.get('/borrowing/overdue');
  return response.data;
};