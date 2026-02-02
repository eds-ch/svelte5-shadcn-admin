import { createContext } from 'svelte';

export class SearchState {
	open: boolean = $state(false);

	toggle = () => {
		this.open = !this.open;
	};

	setOpen = (value: boolean) => {
		this.open = value;
	};
}

export const [getSearch, setSearch] = createContext<SearchState>();
