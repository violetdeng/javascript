# javascript 功能组件

## 表单生成模块Form
###用法
	var data = {                                                        
    	"elements": [{
    		"label": {                       
        		"text": "Text Input"                                 
    		},
    		"elements": [{
    		    "name": "text_input"                                                             
        	}]                                                                                   
    	}]
  	};
  	Form.BootstrapForm(data)；
###支持的类型
    <input type="text">
    <select></select>
    <textarea></textarea>
几乎所有表单元素
***

##翻页时钟
该插件依赖于jquery
###用法
	(new Clock(element)).start();
	(new TurningCounting(element, options)).start();
其中TurningCounting支持的参数有：
number: 计数开始值，默认为0
maxNumber： 计数最大值，默认为10
loop： 是否循环计数，默认为true
trigger： 完成一轮计数后回调函数
change： 完成一次计数后回调函数

