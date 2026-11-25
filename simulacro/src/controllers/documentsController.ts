import type { Request, Response, NextFunction } from 'express';
import * as documentsService from '../services/documentsService.js';
import { AppError } from '../errors/AppError.js';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';

export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    res.json(documentsService.list(page, limit));
  } catch (err) {
    next(err);
  }
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const documentId = String(req.params.documentId);
    const document = documentsService.getById(documentId);

    if (!document) {
      throw new ResourceNotFoundError(404, `Document with id '${documentId}' not found`, 'RESOURCE_NOT_FOUND', documentId);
    }

    res.status(200).json({ data: document });
  } catch (err) {
    next(err);
  }
}

export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body;

    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new AppError(400, 'Missing or invalid required field: title', 'INVALID_TITLE');
    }

    const cleanDescription = description ? String(description).trim() : undefined;
    const newDoc = documentsService.create(title.trim(), cleanDescription);

    res.status(201).json({ data: newDoc });
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const documentId = String(req.params.documentId);
    const { title, description } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      res.status(400).json(
        {
          error: 'INVALID_TITLE',
          message: 'Title must be a non-empty string',
        }
      )
      return;
    }

    const document = documentsService.update(documentId, {
      title: title !== undefined ? title.trim() : undefined,
      description: description !== undefined ? String(description).trim() : undefined,
    });

    if (!document) {
      throw new AppError(404, `Document with id '${documentId}' not found`, 'NOT_FOUND');
    }

    res.json({ data: document });
  } catch (err) {
    next(err);
  }
}