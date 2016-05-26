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
