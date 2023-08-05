export function failedPromise(data: any): Promise<any> {
    return Promise.reject(data);
}

export function passedPromise(data: any): Promise<any> {
    return Promise.resolve(data);
}

export function generateRandomCode():number {
    return Math.floor(1000 + Math.random() * 9000);
}
