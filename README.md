# 复杂网络可视化组件

简化复杂网络代码，尽量组件化视图操作，让逻辑代码更侧重于业务。

## props参数

| 参数            | 说明                                            | 类型        | 默认值 |
-----|-----|-----|------
| width          | 容器宽度                                         | number     |  800  |
| height         | 容器高度                                         | number     |  800  |
| nodeIdKey      | 节点表示键值                                      | string     |  'id' |
| velocityDecay  | 节点速度衰减系数，可理解为摩擦力，0~1之间             | number     |  0.1  |
| linkDistance   | 连线长度                                         | number或(link) => number |  0.1  |
| collideRadius  | 节点碰撞半径                                     | number或(node) => number |  0  |
| collideStrength| 节点碰撞强度，0~1之间                             |  number |  0.5 |
| chargeStrength | 节点之间作用力，整数为引力，负数为斥力               |  number |  -10 |
| staticLayout   | 是否为静态布局（需要事先使用/simulation.js计算节点位置）| boolean |  false |
| XYCenter       | 是否添加x、y作用力，居中效果，避免不连通图游离        | boolean或Object |  {x: 0, y: 0} |
| tick           | 动画回调，每一帧                                 | function(alpah) | noop |
| end            | tick结束回调                                    | function  | noop |
| getNode        | 节点                       | React.Element或(node)=> React.Element  | circle |
| getLink        | 边                         | (link, addRef) => React.Element或object  | link |
| nodeClick      | 节点点击事件                                    | function(node, d3.event)  | noop |
| nodeDbClick    | 节点双击事件                                    | function(node, d3.event)  | noop |
| nodeMouseover  | 节点mouseover事件                              | function(node, d3.event)  | noop |
| nodeMouseout   | 节点mouseout事件                               | function(node, d3.event)  | noop |
| linkClick      | 边点击事件                                    | function(link, d3.event)  | noop |
| linkMouseover  | 边mouseover事件                              | function(link, d3.event)  | noop |
| linkMouseout   | 边mouseout事件                               | function(link, d3.event)  | noop |
| dragEvent      | 节点拖拽事件，start、drag、end三个事件函数        | Object  | {} |
| zoomEvent      | 缩放事件，start、isZoom、zoom、end四个事件函数，isZoom判断是否缩放，返回boolean | Object  | {} |

## API

通过ref方式获取组件示例，使用下列API：

### adaption(animate)

视图居中，animate表示是否动画移动。

### transform(translate, scale, animate)

缩放平移，translate为数组，数组第一个值为x偏移量，第二个值为y偏移量，scale为缩放比例，animate表示是否动画，默认不使用动画。如果不传任何参数，则返回偏移量与缩放比例。

### forceEndTick()

强制停止tick动画动画。

### addLayout(layout, options)

添加布局，layout分为圆形布局circle、阿基米德螺旋布局archimeddeanSpiral、栅格布局grid、分层布局dagre，options为布局参数，返回包含执行布局函数对象。如component.addLayout('circle').execute()，或者使用component.executeLayout('circle',{beforeExecute:() =>{}})

### free()

布局释放，布局layout后节点x、y固定，使用free方法释放节点，变成力导向布局。
