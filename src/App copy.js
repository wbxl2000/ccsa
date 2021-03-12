import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import _ from 'lodash';
import './App.css';

import strokesData from './config/strokes-detail.json';
import systemInfo from './config/system-info.json';
import { images } from './config/images.json';

import {
  Wrapper,
  RightWrapper,
  StrokeShow,
  LeftWrapper,
  CharacterWrapper,
  FunctionWrapper,
  HistoryWrapper,
  Character,
  ButtonWrapper,
  StrokePicture,
  StrokeNameList,
  CurrentStrokeWrapper,
  TitleTextSpan,
  ContextRegularSpan,
  ImageContainer,
  TitleWrapper,
  DataSetTitle,
  TitleTextSpan2,
  Canvas
} from './style';

// import StrokePicker from './components/stroke-picker';

import { Button, Radio, Image, Descriptions, Badge, message, Input } from 'antd';

import { UserOutlined } from '@ant-design/icons';

function difference(object, base) {
  function changes(object, base) {
      return _.transform(object, function(result, value, key) {
          if (!_.isEqual(value, base[key])) {
              result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
          }
      });
  }
  return changes(object, base);
}

const RegisterListener = () => {
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "KeyZ":
          console.log("Z");
          break;
        case "KeyX":
          console.log("X");
          break;
        case "KeyC":
          console.log("C");
          break;
        case "KeyV":
          console.log("V");
          break;
        default: 
          break;
      }
    })
}

const TextRegular = (text) => {
  return (
    <ContextRegularSpan>{text}</ContextRegularSpan>
  )
}


const DescriptionArea = (currentStroke) => {
  const origin = currentStroke.src;
  const nowPoint = currentStroke.status.nowPoint;
  const length = currentStroke.src.strokeOrder.length;
  return (
    <Descriptions title={
      <TitleWrapper>
        <TitleTextSpan>当前笔画信息：{`${origin.id} - ${origin.name}`} </TitleTextSpan>
        <div>
          <Badge status={nowPoint === length ? "success" : "processing"}></Badge>
          {TextRegular(`关键点标记进度[${nowPoint}/${length}]`)}
        </div>
      </TitleWrapper>
    } bordered>
      <Descriptions.Item label={TextRegular('笔画示意图')}>
        <ImageContainer>
          <Image src={`/assets/stroke-example/${currentStroke.src.strokeOrder.imageUrl}`} />
        </ImageContainer>
      </Descriptions.Item>
      <Descriptions.Item label={TextRegular('节点分布图')} span={2}>
        <ImageContainer>
          <Image src={`/assets/stroke-order/${currentStroke.src.strokeOrder.imageUrl}`} />
        </ImageContainer>
      </Descriptions.Item>
    </Descriptions>
  )
};

const getMapImageUrls = () => {
    const res = {};
    images.forEach((image) => {
      res[image.id] = image.fileName;
    });
    return res;
}

const getMapImageCIds = () => {
  // console.log("getMapImageCIds");
  const res = {};
  images.forEach((image) => {
    res[image.id] = image.c_id;
  });
  return res;
}


const ResultResponse = (id) => {
  // const promise = axios.get("http://localhost:4000/api/characters?id=" + id);

  // const dataPromise = promise.then((response) => response.data);

  // return dataPromise;

  async function getData() {
    return await axios.get("http://localhost:4000/api/characters?id=" + id);
  }
  
  (async () => {
    // console.log(await getData().data)
    return await getData().data
  })()
  
  // return (
  //   // char ? (
  //   //   char.strokes.map((item) => {
  //   //     let name = "";
  //   //     strokesData.strokes.forEach((item2) => {
  //   //       if (item2.id === item) {
  //   //         name = item2.name;
  //   //       }
  //   //     });
  //   //     // console.log(result, item, result[`s_${item}`]);
  //   //     return (
  //   //       <div>
  //   //         {name}: {result[`s_${item}`].map(item => {
  //   //           return JSON.stringify(item);
  //   //         })}
  //   //       </div>
  //   //     )
  //   //   })
  //   // ) : null
  //     <div></div>
  // )
}

const App = () => {
  // useRef Hooks
  const canvasRef = useRef(null);
  
  // useEffect Hooks
  const [ ImagesUrls, MapUrls ] = useState({});
  const [ ImagesCIds, MapCIds] = useState({});
  const [ currentImageInfo, setInfo ] = useState({
    id: systemInfo.currentImageId,
    dataSetId: systemInfo.dataSetId,
    author: systemInfo.author
  });
  const [ currentStroke, setStroke ] = useState({
    status: {
      nowPoint: 0,
      nowStroke: 1
    },
    src: {
      id: 1,
      name: "横",
      strokeOrder: {
        length: 2,
        imageUrl: "stroke-01.png"
      },
      exampleUrl: "stroke-01.png",
      connections: [
        [1, 2]
      ]
    }
  });
  let defaultResult = { };
  for (let i = 1; i <= 31; ++i) {
    defaultResult[`s_${i}`] = [];
  }
  const [ result, setResult ] = useState(defaultResult);
  const [ tempPoints, addPoints ] = useState([]);

  // useEffect Hooks
  useEffect(RegisterListener, []);
  useEffect(() => MapUrls(getMapImageUrls), []);
  useEffect(() => MapCIds(getMapImageCIds), []);
  useEffect(() => {
    if (currentStroke.status.nowPoint === currentStroke.src.strokeOrder.length) {
      message.success('此笔画已完成，按下快捷键「C」进入下一个笔画');
      return;
    }
  }, [currentStroke])

  const submitStroke = () => {
    setResult(() => result[`s_${currentStroke.src.id}`].push(tempPoints));
    addPoints([]);
  }

  const Paint = (e) => {
    if (currentStroke.status.nowPoint + 1 > currentStroke.src.strokeOrder.length) {
      message.error('关键点数量溢出，请检查数量');
      return;
    }
    const canvas = canvasRef.current;
    const { left, top } = canvas.getBoundingClientRect();
    const x = e.clientX - left, y = e.clientY - top;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2*Math.PI);
    ctx.strokeStyle = "magenta";
    ctx.fillStyle = "magenta";
    ctx.stroke();
    setStroke({
      status: {
        nowPoint: currentStroke.status.nowPoint + 1,
        nowStroke: currentStroke.status.nowStroke
      },
      src: currentStroke.src
    });
    addPoints(() => {
      return [...tempPoints, [x, y]];
    });
  }

  const canvasClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 256, 256);
    setStroke({
      status: {
        nowPoint: 0,
        nowStroke: currentStroke.status.nowStroke
      },
      src: currentStroke.src
    });
    addPoints([]);
  }

  const nextStroke = () => {
    // characters[`c_${currentStroke.src.id}`].strokes
    // const ns = strokesData.strokes[currentStroke.status.nowStroke]
    setStroke({
      status: {
        nowPoint: 0,
        nowStroke: currentStroke.status.nowStroke + 1
      },
      src: {
        id: strokesData.strokes[currentStroke.status.nowStroke],
        name: "横",
        strokeOrder: {
          length: 2,
          imageUrl: "stroke-01.png"
        },
        exampleUrl: "stroke-01.png",
        connections: [
          [1, 2]
        ]
      }
    });
    canvasClear();
    setResult(() => {
      const origin = result;
      origin[`s_${currentStroke.src.id}`].push(tempPoints);
      return origin;
    });
    addPoints([]);
  }


  return (
    <Wrapper>
      <LeftWrapper>
        <StrokeNameList>
          <TitleTextSpan></TitleTextSpan>
          <span style={{ "font-size": "25px", marginBottom: "20px" }}>笔画列表（自动选择）</span>
          <Radio.Group value={currentStroke.src.id} size="large" buttonStyle="solid">
            {
              strokesData.strokes.map((item) => {
                return (
                  <Radio.Button key={`stroke_${item.id}`} value={item.id} 
                    onClick={() => message.warning("目前不允许修改笔顺，请修改配置文件适配")}
                  >
                    { item.name }
                  </Radio.Button>
                )
              })
            }
          </Radio.Group>
        </StrokeNameList>
        <StrokeShow>
          { DescriptionArea(currentStroke) } 
        </StrokeShow >
      </LeftWrapper>
      {/* <RightWrapper>
        <DataSetTitle>
          <TitleWrapper>
            <TitleTextSpan>数据集：{currentImageInfo.dataSetId}号</TitleTextSpan>
            <Input 
              style={{ width: '40%' }} 
              size="large" 
              placeholder="记录人" 
              prefix={<UserOutlined />} 
              value={currentImageInfo.author} 
              onChange={e => setInfo({
                  id: currentImageInfo.id,
                  dataSetId: currentImageInfo.dataSetId,
                  author: e.target.value
                })
              }
            />
          </TitleWrapper>
          
          <TitleTextSpan2><Badge status="processing" />进度：[1/100]</TitleTextSpan2>
        </DataSetTitle>
        <CharacterWrapper>
          <FunctionWrapper>
            <span>请在红框内进行标记</span>
            <Character>
              <img 
                style={{
                  left: "0px",
                  position: "absolute"
                }}
                src={`/assets/source/${currentImageInfo.dataSetId}/${ImagesUrls[currentImageInfo.id]}`}
              >
              </img>
              <canvas
                width="256px"
                height="256px"
                ref={canvasRef}
                onClick={e => Paint(e)}
              >
              </canvas>
            </Character>
            <ButtonWrapper>
              <Button size="large" type="primary" onClick={canvasClear}> 清空关键点（Z）</Button>
              <Button size="large" type="primary" >重新开始本字（X）</Button>
              <Button size="large" type="primary" onClick={nextStroke}>下一个笔画（C）</Button>
              <Button size="large" type="primary" onClick={submitStroke}>提交本字（V）</Button>
              <Button size="large" type="primary">本字难以辨认，跳过（H）</Button>
            </ButtonWrapper>
          </FunctionWrapper>
          <HistoryWrapper>
            <ContextRegularSpan
              style={{
                margin: 10,
                borderBottom: '1px solid black'
              }}
            >
              输出结果<br></br>
            </ContextRegularSpan>
            { ResultResponse(1) }
          </HistoryWrapper>
        </CharacterWrapper>
      </RightWrapper> */}
    </Wrapper>
  );
}

export default App;
