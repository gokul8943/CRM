import {
    Request,
    Response,
} from 'express';

import {
    ReportService,
} from './report.service';

import {
    asyncHandler,
} from '../../utils/asyncHandler';

export class ReportController {
    private reportService: ReportService;

    constructor() {
        this.reportService =
            new ReportService();
    }

    getSummary = asyncHandler(
        async (
            _req: Request,
            res: Response
        ) => {
            const summary =
                await this.reportService
                    .getSummary();

            res.status(200).json({
                success: true,
                message:
                    'Report summary fetched successfully',
                data: summary,
            });
        }
    );
}