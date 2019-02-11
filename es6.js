// es6
define([ 'jquery'], function($) {
	class Tools{
		constructor(){
			this.message = '测试class';
		}
		
		//es6 promise请求ajax
		ajax(options,button = true){
			let promise = new Promise(function(resolve, reject) {
				$.ajax({
					url: options.url,
					data : options.data || '',
		            		contentType: options.contentType || 'application/json; charset=UTF-8',
					type : options.type || 'GET',
					dataType : 'json',
					success : function(result) {
						resolve(result);
					},
					error : function(result) {
						reject(result);
					}
				});
			});
			return promise;
		}
		//数组拼接去重，返回新数组
		concat(arr1,arr2){ 
			let arr = arr1.concat(); 
			for(let i=0;i<arr2.length;i++){ 
				arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0; 
			} 
			return arr;
		}
		//从数组1中删除数组2，返回数组1
		remove(arr1,arr2){
			Array.prototype.indexOf = function(val) {
				for (let i = 0; i < this.length; i++) {
					if (this[i] == val) {
						return i;
					}
				}
				return -1;
			};
			Array.prototype.remove = function(val) {
			let index = this.indexOf(val);
				if (index > -1) {
					this.splice(index, 1);
				}
			};
			for(let i of arr2){
				arr1.remove(i)
			}
			return arr1;
		}
		//测试静态方法,static 不能通过实例调用static 
		static sTest(){
			return this.message;
		}
		//测试用
		test(){
			return this.message;
		}
	}
	return new Tools();
})

// es6

class Dog{
    constructor(){
        this.hairColor = null;//string
        this.age = null;//number
        this._breed = null;//string
        this._init();
        Dog.instanceNumber++;
    }
    _init(){
        this.hairColor = '白色';
        this.age = 2;
        this._breed = '贵宾';
    }
    get breed(){
        /*其实就是通过getter实现的，只是ES6写起来更简洁*/
        console.log('监听到了有人调用这个get breed接口');
        return this._breed;
    }
    set breed(breed){
        /*跟ES5一样，如果不设置的话默认breed无法被修改，而且不会报错*/
        console.log('监听到了有人调用这个set breed接口');
        this._breed = breed;
        return this;
    }
    gnawBone() {
        console.log('这是本狗最幸福的时候');
        return this;
    }
    getInstanceNumber() {
        return Dog.instanceNumber;
    }
}
Dog.instanceNumber = 0;
var dog = new Dog();
console.log(dog.breed);
/*log:
    '监听到了有人调用这个get breed接口'
    '贵宾'
*/
dog.breed = '土狗';//log:'监听到了有人调用这个set breed接口'
console.log(dog.breed);
/*log:
    '监听到了有人调用这个get breed接口'
    '土狗'
*/

// es5
function Dog(){
    /*公有属性*/
    this.hairColor = null;//string
    this.age = null;//number
    /*私有属性，人们共同约定私有属性、私有方法前面加上_以便区分*/
    this._breed = null;//string
    this._init();
    /*属性的初始化最好放一个私有方法里，构造函数最好只用来声明类的属性和调用方法*/
    Dog.instanceNumber++;
}
/*静态属性*/
Dog.instanceNumber = 0;
/*私有方法，只能类的内部调用*/
Dog.prototype._init = function(){
    this.hairColor = '白色';
    this.age = 2;
    this._breed = '贵宾';
}
/*公有方法：获取属性的接口方法*/
Dog.prototype.getBreed = function(){
    console.log('监听到了有人调用这个getBreed()接口')
    return this._breed;
}
/*公有方法：设置属性的接口方法*/
Dog.prototype.setBreed = function(breed){
    this._breed = breed;
    return this;
    /*这是一个小技巧，可以链式调用方法，只要公有方法没有返回值都建议返回this*/
}
/*公有方法：对外暴露的行为方法*/
Dog.prototype.gnawBone = function() {
    console.log('这是本狗最幸福的时候');
    return this;
}
/*公有方法：对外暴露的静态属性获取方法*/
Dog.prototype.getInstanceNumber = function() {
    return Dog.instanceNumber;//也可以this.constructor.instanceNumber
}
var dog = new Dog();
console.log(dog.getBreed());
/*log:
    '监听到了有人调用这个getBreed()接口'
    '贵宾'
*/
/*链式调用，由于getBreed()不是返回this,所以getBreed()后面就不可以链式调用了*/
var dogBreed = dog.setBreed('土狗').gnawBone().getBreed();
/*log：
    '这是本狗最幸福的时候'
    '监听到了有人调用这个getBreed()接口'
*/
console.log(dogBreed);//log: '土狗'
console.log(dog);


// 闭包
function isType(type){
    return function(obj){
        return Object.prototype.toString.call(obj) == '[object '+ type + ']'
    }
}

//定义一个判断是否为函数类型的函数
var isFunction = isType('Function'); 
var isString = isType('String');

//测试
var name = 'Tom';    
isString(name)//true