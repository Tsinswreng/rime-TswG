import { describe,it,expect } from '@/UnitTest'
export function run(this:void){
	// 测试示例
	describe("Simple Jest Test", () => {
		it("should add two numbers correctly", () => {
			expect(1 + 2).toBe(3);
		});
	
		it("should check if strings are equal", () => {
			expect("hello").toBe("hello");
		});
	
		it("should throw an error if values are not equal", () => {
			expect(5).toBe(5);
			// Uncomment the line below to see the failure case
			// expect(5).toBe(10);
		});
	});
}