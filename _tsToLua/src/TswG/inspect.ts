function customInspect(obj: any, depth: number = 2, currentDepth: number = 0): string {
	// 基本類型處理
	if (obj === null) return 'null';
	if (typeof obj === 'undefined') return 'undefined';
	if (typeof obj === 'string') return `"${obj}"`;
	if (typeof obj === 'number' || typeof obj === 'boolean') return ""+(obj);
	
	// 限制深度
	if (currentDepth >= depth) return '...';

	// 處理數組
	if (Array.isArray(obj)) {
		const items = obj.map(item => customInspect(item, depth, currentDepth + 1));
		return `[${items.join(', ')}]`;
	}

	// 處理對象
	if (typeof obj === 'object') {
		const keys = Object.keys(obj);
		const properties = keys.map(key => {
			const value = customInspect(obj[key], depth, currentDepth + 1);
			return `${key}: ${value}`;
		});
		return `{ ${properties.join(', ')} }`;
	}

	// 處理其他情況
	return ""+(obj);
}

// 示例用法
const exampleObject = {
	name: 'Alice',
	age: 30,
	hobbies: ['reading', 'gaming'],
	address: {
		city: 'Wonderland',
		zip: '12345'
	}
};

console.log(customInspect(exampleObject, 2));
