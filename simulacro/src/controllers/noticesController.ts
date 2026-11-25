import type { Request, Response, NextFunction } from 'express';
import * as noticesService from '../services/noticesService.js';
import { AppError } from '../errors/AppError.js';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';

export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 2);

    if (!Number.isInteger(page) || page <= 0 || !Number.isInteger(limit) || limit <= 0 ){
      throw new AppError(400, `Page and limit must be positive and integer`, `INVALID_PAGINATION`)
    }

    const search = req.query.search ? String(req.query.search).trim() : undefined;

    res.json(noticesService.list(page, limit, search));
  } catch (err) {
    next(err);
  }
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const noticeId = String(req.params.noticeId);
    const notice = noticesService.getById(noticeId);

    if (!notice) {
      throw new ResourceNotFoundError(404, `Notice with id '${noticeId}' not found`, 'RESOURCE_NOT_FOUND', noticeId);
    }

    res.status(200).json({data: notice})
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

    if (description !== undefined && typeof description !== 'string'){
      throw new AppError(400, 'Invalid field: description must be a string', 'INVALID_DESCRIPTION');
    }

    const cleanDescription = description !== undefined ? description.trim(): '';
    const newNotice = noticesService.create(title.trim(), cleanDescription);

    res.status(201).json({ data: newNotice });
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const noticeId = String(req.params.noticeId);
    const { title, description } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      throw new AppError(400,'Title must be a non-empty string', 'INVALID_TITLE')
    }

    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Description must be a string', 'INVALID_DESCRIPTION');
    }

    const notice = noticesService.update(noticeId, {
      title: title !== undefined ? title.trim() : undefined,
      description: description !== undefined ? description.trim() : undefined,
    });

    if (!notice) {
      throw new ResourceNotFoundError(404, `Notice with id '${noticeId}' not found`, 'RESOURCE_NOT_FOUND', noticeId);
    }

    res.status(200).json({ data: notice });
  } catch (err) {
    next(err);
  }
}