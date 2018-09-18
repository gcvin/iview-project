# vpaper
vue paper 翻页动画

### demo地址
[demo演示页面](http://gcvin.herokuapp.com/upload/, 'paper 翻页动画演示页面')

### 插件的安装
#### NPM 
```
npm i vpaper
```
#### 引入插件
```
import Vue from 'vue';
import vpaper from 'vpaper';

Vue.use(vpaper);
```

#### 基本用法  
```html
<vpaper :pages="6" :delay="500"></vpaper>
```

### API  
| 参数 | 说明 | 类型 | 默认值 |  
| - | :- | :- | :-: |  
| pages | paper总页数 | Number | 6 | 
| delay | 翻页动画持续时间| Number | 500 |
