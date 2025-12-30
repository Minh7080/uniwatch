export type setDatePresetInput = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

export default function getDatePreset
  (input: setDatePresetInput): { from?: Date, to?: Date } {
  switch (input) {
    case 'today':
      return {
        from: new Date(),
        to: new Date(),
      };
    case 'week': {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7);
      return {
        from: fromDate,
        to: new Date(),
      };
    }
    case 'month': {
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
      return {
        from: fromDate,
        to: new Date(),
      };
    }
    case 'year': {
      const fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      return {
        from: fromDate,
        to: new Date(),
      };
    }
    case 'custom':
    case 'all':
      return {
        from: undefined,
        to: undefined,
      };
  }
};
