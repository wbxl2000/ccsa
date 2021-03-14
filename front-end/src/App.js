import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

import strokesData from './config/strokes-detail.json';
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
  StrokeNameList,
  TitleTextSpan,
  ContextRegularSpan,
  ImageContainer,
  TitleWrapper,
  DataSetTitle,
  TitleTextSpan2
} from './style';

// import StrokePicker from './components/stroke-picker';

import { Button, Radio, Progress, Image, Descriptions, Badge, message, Input, Spin, Alert } from 'antd';

import { UserOutlined } from '@ant-design/icons';

const TextRegular = (text) => {
  return (
    <ContextRegularSpan>{text}</ContextRegularSpan>
  )
}

const getMapImageUrls = () => {
    const res = {};
    images.forEach((image) => {
      res[image.id] = image.fileName;
    });
    return res;
}

const App = () => {
  // useRef Hooks
  const canvasRef = useRef(null);
  
  // useState Hooks
  const [ currentStroke, setCurrentStroke ] = useState({});
  const [ currentChar, setCurrentChar ] = useState({});
  const [ strokeList, setStrokeList ] = useState({});
  const [ strokeIndex, setStrokeIndex ] = useState(1); // 现在是第几个笔画
  const [ strokeCompleted,  setStrokeCompleted] = useState(false); // 记录是否完成当前字
  const [ imagesUrls, mapUrls ] = useState({});
  const [ systemInfo, setSystemInfo ] = useState({});
  const [ result, setResult ] = useState([]);
  const [ tempPoints, addPoints ] = useState([]);
  const [ currentAuthor, setCurrentAuthor ] = useState([]);

  // Loading
  const [ sysInfoLoading, setSysInfoLoading ] = useState(true);
  const [ currentCharLoading, setCurrentCharLoading ] = useState(true);
  const [ strokeListLoading, setStrokeListLoading ] = useState(true);
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ submitSuccess, setSubmitSuccess ] = useState(false);

  // useEffect Hooks
    // init char
  useEffect(() => {
    (async () => {
      setSysInfoLoading(() => true);
      const reqResult = await axios('http://localhost:4000/api/system-info');
      setSystemInfo(() => reqResult.data);
      setSysInfoLoading(() => false);
    })();
    canvasClear(); // 顺便清空一下canvas
  }, [ submitSuccess ]);
    // 重新获取字的信息和笔画的信息
  useEffect(() => {
    if (sysInfoLoading) return;
    (async () => {
      setCurrentCharLoading(() => true);
      const reqResult = await axios('http://localhost:4000/api/character-info?id=' + systemInfo.currentImageId);
      setCurrentChar(() => reqResult.data);
      setCurrentCharLoading(() => false);
      setSubmitSuccess(() => false);
      setStrokeIndex(() => 1);
      setStrokeCompleted(() => false);
      setResult(() => []);
      setCurrentAuthor(() => systemInfo.author);
    })();
  }, [ sysInfoLoading, systemInfo ]);
    // 如果获取了字的信息，那么更新笔画的信息
  useEffect(() => {
    if (currentCharLoading) return;
    (async () => {
      setStrokeListLoading(() => true);
      const reqResult = await axios('http://localhost:4000/api/strokes-list?id=' + currentChar.c_id);
      setStrokeList(() => reqResult.data);
      setStrokeListLoading(() => false);
    })();
  }, [ currentCharLoading, currentChar ]);
    // 笔画列表动了，那笔画进度肯定要清零。
  useEffect(() => {
    setStrokeIndex(() => 1);
  }, [ strokeList ]);
    // 笔画进度一旦修改，那么当前笔画一定要更新，缓存数据要清零
  useEffect(() => {
    if (strokeListLoading) return;
    // console.log("who" + strokeList[strokeIndex-1]);
    // console.log(strokesData);
    console.log(strokesData.strokes.find(stroke => stroke.id === strokeList[strokeIndex-1]));
    setCurrentStroke(() => strokesData.strokes.find(stroke => stroke.id === strokeList[strokeIndex-1]));
    addPoints(() => []);
  }, [ strokeListLoading, strokeIndex, strokeList ]);


  useEffect(() => mapUrls(getMapImageUrls), []);

  const Paint = (e) => { // 每次点击canvas
    // console.log(tempPoints.length, currentStroke.strokeOrderLength);
    if (tempPoints.length + 1 > currentStroke.strokeOrderLength) {
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
    // console.log(tempPoints);
    addPoints(() => {
      return [...tempPoints, [x, y]];
    });
  }

  const canvasClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 256, 256);
    addPoints(() => []);
  };

  const nextStroke = () => {
    // console.log(tempPoints.length, currentStroke.strokeOrderLength);
    if (strokeCompleted) {
      message.warning("已经录入完成所有笔画，请进入下一个字");
      return;
    }
    if (tempPoints.length !== currentStroke.strokeOrderLength) {
      message.warning("关键点录入未完成");
      return;
    }
    const thisStroke = {
      id: currentStroke.id,
      name: currentStroke.name,
      record: tempPoints
    }
    canvasClear();
    setResult(() => [...result, thisStroke]);
    if (strokeIndex < strokeList.length) {
      setStrokeIndex(strokeIndex => strokeIndex + 1);
    } else {
      setStrokeCompleted(true);
    }
  };

  const reStartChar = () => {
    canvasClear();
    setResult(() => []);
    setStrokeCompleted(() => false);
    setStrokeIndex(() => 1);
  };

  const submitChar = (skip) => {
    if (!strokeCompleted && !skip) {
      message.warning("笔画数量未达到预设标准");
      return;
    }
    setSubmitLoading(true);
    (async () => {
      // console.log(currentChar);
      const ans = {
        dataSetId: systemInfo.dataSetId,
        currentImageId: systemInfo.currentImageId,
        author: currentAuthor,
        charId: currentChar.id,
        skip,
        charName: currentChar.name,
        result
      }
      const reqResult = await axios.post('http://localhost:4000/api/submit', ans);
      // console.log(reqResult.data);
      (reqResult.data === "success") && setSubmitSuccess(() => true);
      setSubmitLoading(false);
    })();
  };

  return (
    <Wrapper>
      <LeftWrapper>
        <StrokeNameList>
          <span style={{ fontSize: "25px", margin: "10px" }}>笔画列表（自动选择）</span>
          {
            strokeListLoading ? (
              <Spin tip="Loading...">
                <Alert
                  message="strokeList"
                  description="strokeList strokeList strokeList strokeList strokeList strokeList "
                  type="info"
                />
              </Spin>
            ) : (
              <Radio.Group 
                style={{margin: "17px" }}
                value={strokeList[strokeIndex-1]} size="large" buttonStyle="solid">
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
            )
          }
        </StrokeNameList>
        <StrokeShow>
          { 
            currentCharLoading ? (
              <Spin tip="Loading...">
                <Alert
                  message="currentChar"
                  description="currentChar currentChar currentChar currentChar currentChar currentChar"
                  type="info"
                />
              </Spin>
            ) : (
              <Descriptions 
                style={{ height: "auto", width: "650px", padding: "20px", 
                  border: "1px solid black",
                  borderRadius: "10px",
                  borderTop: "1px solid white"}}
                title={
                  <TitleWrapper>
                    <TitleTextSpan>当前笔画信息：{`${currentStroke.id} - ${currentStroke.name}`} </TitleTextSpan>
                    <div>
                      {/* <Badge status={tempPoints.length === currentStroke.strokeOrderLength ? "success" : "processing"}></Badge> */}
                      {TextRegular(`关键点标记进度[${tempPoints.length}/${currentStroke.strokeOrderLength}]: `)}
                      <Progress percent={(tempPoints.length/currentStroke.strokeOrderLength)*100} steps={currentStroke.strokeOrderLength} showInfo={false}/>
                    </div>
                  </TitleWrapper>
                } 
                bordered
              >
                <Descriptions.Item label={TextRegular('笔画示意图')}>
                  <ImageContainer>
                    <Image src={`/assets/stroke-example/${currentStroke.strokeOrderImageUrl}`} />
                  </ImageContainer>
                </Descriptions.Item>
                <Descriptions.Item label={TextRegular('节点分布图')} span={2}>
                  <ImageContainer>
                    <Image src={`/assets/stroke-order/${currentStroke.strokeOrderImageUrl}`} />
                  </ImageContainer>
                </Descriptions.Item>
              </Descriptions>
            )
          } 
        </StrokeShow >
      </LeftWrapper>
      <RightWrapper>
            {
              sysInfoLoading && currentCharLoading ? (
              <Spin tip="Loading...">
                <Alert
                  message="sysInfo, currentChar"
                  description=" "
                  type="info"
                />
              </Spin>
              ) : (
                <DataSetTitle>
                  <TitleWrapper>
                    <TitleTextSpan>
                      数据集：{systemInfo.dataSetId}号
                      {/* <span style={{fontSize: "20px", color: "#909090"}}>     进度：[{systemInfo.currentImageId}/{systemInfo.total}]</span> */}
                    </TitleTextSpan>
                    <Input 
                      style={{ width: '40%' }} 
                      size="large" 
                      placeholder="记录人" 
                      prefix={<UserOutlined />} 
                      value={currentAuthor} 
                      onChange={e => setCurrentAuthor(() => e.target.value)}
                    />
                  </TitleWrapper>
                  <TitleTextSpan2><Badge status="processing" />当前字："{currentChar.name}"，进度：{systemInfo.currentImageId}/{systemInfo.total}</TitleTextSpan2>
                </DataSetTitle>
              )
            }
        <CharacterWrapper>
          <FunctionWrapper>
            <span>请在红框内进行标记</span>
            <Character>
              {
                sysInfoLoading ? (
                <Spin tip="Loading...">
                  <Alert
                    message="sysInfo"
                    description="sysInfo sysInfo sysInfo sysInfo "
                    type="info"
                  />
                </Spin>
                ) : (
                  <img 
                    alt=""
                    style={{
                      left: "0px",
                      position: "absolute"
                    }}
                    src={`/assets/source/${systemInfo.dataSetId}/${imagesUrls[systemInfo.currentImageId]}`}
                  >
                  </img>
                )
              }

              <canvas
                width="256px"
                height="256px"
                ref={canvasRef}
                onClick={e => Paint(e)}
              >
              </canvas>
            </Character>
            <ButtonWrapper>
              <Button 
                size="large" 
                type="primary" 
                onClick={() => nextStroke()}
                disabled={tempPoints.length !== currentStroke.strokeOrderLength}
              >下一个笔画（C）</Button>
              <Button size="large" onClick={() => canvasClear}> 清空该笔画关键点（Z）</Button>
              <Button size="large" danger onClick={() => reStartChar}>重新开始本字（X）</Button>
              <Button size="large" type="dashed" danger onClick={() => submitChar(true)}>本字难以辨认，跳过（H）</Button>
            </ButtonWrapper>
          </FunctionWrapper>
          <HistoryWrapper>
            <ContextRegularSpan
              style={{
                margin: 10,
                borderBottom: '2px solid black'
              }}
            >
              输出结果<br></br>
            </ContextRegularSpan>
            <div style={{ overflow: "scroll", height: "340px", width: "100%"}}>
            { 
              strokeListLoading ? (
                <Spin tip="strokeList">
                </Spin>
              ) : (
                  result.map((item, index) => {
                    // console.log(item);
                    return (
                        <div key={index} style={{ fontSize: "18px", display: "flex", flexDirection: "column", alignItems: "center" }}> 
                          <span>
                            ({index + 1}) {item.name}
                          </span>
                          <span
                            style={{
                              margin: 5,
                              borderBottom: '1px solid gray'
                            }}
                          >
                            <div 
                              // style={{ fontSize: "18px", display: "flex", flexDirection: "column", alignItems: "center" }}
                            >
                              {
                                item.record.map((item2, index2) => {
                                  return (
                                    <span key={index2}> ({item2[0]}, {item2[1]})</span>
                                  )
                                })
                              }
                            </div>
                          </span>
                        </div>
                    )
                  })
              )
            }
            </div>
            <div>
              <Progress style={{margin: "10px"}} type="circle" status={ submitSuccess ? null : "active"} percent={
                strokeCompleted ? 100 : (((strokeIndex-1)/strokeList.length)*100)
              } width={80} />
              { submitLoading ? (<Spin />) : null }
            </div>
            <Button 
              // style={{margin: "10px"}} 
              size="large" type="primary" 
              onClick={() => submitChar(false)} 
              disabled={!strokeCompleted}
            >提交本字（V）</Button>
          </HistoryWrapper>
        </CharacterWrapper>
      </RightWrapper>
    </Wrapper>
  );
}

export default App;




  // const keyAction = useCallback(
  //   (e) => {
  //     switch (e.code) {
  //       case "KeyC":
  //         nextStroke();
  //         break;
  //       case "KeyZ":
  //         // canvasClear();
  //         break;
  //       case "KeyX":
  //         // reStartChar();
  //         break;
  //       case "KeyV":
  //         // submitChar();
  //         break;
  //       case "KeyV":
  //         console.log("V");
  //         break;
  //       default: 
  //         break;
  //     }
  //   }, [ nextStroke ]);

  // useEffect(() => {
  //   window.addEventListener("keydown", keyAction);
  //   return () => {
  //     document.removeEventListener("keydown", keyAction);
  //   }
  // }, [ keyAction ]);