import { ReportRepository } from './report.repository';

export class ReportService {
    private reportRepository: ReportRepository;

    constructor() {
        this.reportRepository =
            new ReportRepository();
    }

    async getSummary() {
        const summary =
            await this.reportRepository
                .getDealSummary();

        return {
            wonDeals: summary.wonDeals,
            lostDeals: summary.lostDeals,
            inProgressDeals:
                summary.inProgressDeals,

            totalClosedValue:
                summary.totalClosedValue,

            wonValue:
                summary.wonValue,

            lostValue:
                summary.lostValue,
        };
    }
}