import { Router } from 'express';

import {
    ReportController,
} from './report.controller';

const router = Router();

const reportController =
    new ReportController();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: CRM reporting APIs
 */

/**
 * @swagger
 * /reports/summary:
 *   get:
 *     summary: Get deal summary
 *     description: Returns counts of won, lost, and in-progress deals along with closed deal value.
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Report summary fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Report summary fetched successfully"
 *               data:
 *                 wonDeals: 15
 *                 lostDeals: 7
 *                 inProgressDeals: 23
 *                 totalClosedValue: 1250000
 *                 wonValue: 950000
 *                 lostValue: 300000
 *       500:
 *         description: Internal server error
 */
router.get(
    '/summary',
    reportController.getSummary
);

export default router;