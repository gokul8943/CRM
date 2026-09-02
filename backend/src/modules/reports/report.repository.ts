import { Deal, DealStage } from '../../models/deal.model';

export class ReportRepository {
    async getDealSummary() {
        const result = await Deal.aggregate([
            {
                $group: {
                    _id: null,

                    wonDeals: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$stage',
                                        DealStage.CLOSED_WON,
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    lostDeals: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$stage',
                                        DealStage.CLOSED_LOST,
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    inProgressDeals: {
                        $sum: {
                            $cond: [
                                {
                                    $not: {
                                        $in: [
                                            '$stage',
                                            [
                                                DealStage.CLOSED_WON,
                                                DealStage.CLOSED_LOST,
                                            ],
                                        ],
                                    },
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    totalClosedValue: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        '$stage',
                                        [
                                            DealStage.CLOSED_WON,
                                            DealStage.CLOSED_LOST,
                                        ],
                                    ],
                                },
                                '$value',
                                0,
                            ],
                        },
                    },

                    wonValue: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$stage',
                                        DealStage.CLOSED_WON,
                                    ],
                                },
                                '$value',
                                0,
                            ],
                        },
                    },

                    lostValue: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$stage',
                                        DealStage.CLOSED_LOST,
                                    ],
                                },
                                '$value',
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        return (
            result[0] ?? {
                wonDeals: 0,
                lostDeals: 0,
                inProgressDeals: 0,
                totalClosedValue: 0,
                wonValue: 0,
                lostValue: 0,
            }
        );
    }
}