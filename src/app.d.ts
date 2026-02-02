declare module '@tanstack/table-core' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		label?: string;
		className?: string;
	}
}

declare global {
	namespace App {
		interface Error {
			message: string;
			status?: number;
		}
		interface Locals {}
		interface PageData {
			sidebarOpen: boolean;
			sidebarCollapsible: string;
			sidebarVariant: string;
			font: string;
			themePreset: string;
			colorMode: string;
			viewApps: string;
		}
		interface PageState {
			taskDialog?: {
				type: 'create' | 'update';
				row: import('./routes/(app)/tasks/data/schema.js').Task | null;
			};
			userDialog?: {
				type: 'add' | 'edit' | 'invite';
				row: import('./routes/(app)/users/data/schema.js').User | null;
			};
		}
	}
}

export {};
