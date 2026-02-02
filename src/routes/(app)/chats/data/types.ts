export interface ChatMessage {
	sender: string;
	message: string;
	timestamp: string;
}

export interface ChatUser {
	id: number;
	avatar: string;
	fullName: string;
	username: string;
	title: string;
	email: string;
	role: string;
	onlineStatus: boolean;
	messages: ChatMessage[];
}
