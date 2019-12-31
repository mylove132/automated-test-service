import { Method } from 'axios';

// type转换成method文字
export function getRequestMethodTypeString(type: number): Method {
	switch (type) {
		case 0:
			return 'GET';
		case 1:
			return 'POST';
		case 2:
			return 'DELETE';
		case 3:
			return 'PUT';
		default:
			return 'GET';
	}
}

// 根据环境转换endpoint
export function generateEndpointByEnv(env: string, endpoint: string): string {
	return endpoint
}