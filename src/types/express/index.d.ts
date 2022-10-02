import express from 'express';

interface User {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
