const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
};

class NPromise {
    constructor(executer) {
        if(typeof executer !== 'function') {
            throw new Error('Executer must be a function');
        }

        this.state = STATE.PENDING;
        this.value = undefined;
        this.onFulfillChain = [];
        this.onRejectCallChain = [];

        executer(this.resolve.bind(this), this.reject.bind(this)); // usar o bind para o this de dentro da função saber que é o this daquela classe
    }

    then(onFulfill) {
        return new NPromise(resolve => {
            const onFulfilled = res => {
                resolve(onFulfill(res)); 
            }

            if(this.state === STATE.FULFILLED) {
                onFulfilled(this.value)
            } else {
                this.onFulfillChain.push(onFulfilled)
            }
        });
    }
 
    resolve(res) {
        if(this.state !== STATE.PENDING) {
            return;
        }

        if(res != null && typeof res.then == 'function') {
            return res.then(this.resolve.bind(this));
        }

        this.state = STATE.FULFILLED;
        this.value = res;

        for(const onFulfilled of this.onFulfillChain) {
            onFulfilled(res);
        }
    }

    catch(onReject) {
        return new NPromise((resolve, reject) => {
            const onRejected = res => {
                try{
                    resolve(onReject(res));
                }catch(error){
                    reject(error);
                }
            };
            
            if(this.state === STATE.REJECTED) {
                onRejected(this.value);
            } else {
                this.onRejectCallChain.push(onRejected);
            }
        })
    }

    reject(error) {
        if(this.state !== STATE.PENDING) {
            return;
        }

        this.state = STATE.REJECTED;
        this.value = error;

        for(const onRejected of this.onRejectCallChain) {
             onRejected(error);
        }
    }
};

module.exports = NPromise;