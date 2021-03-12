import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 50px auto;
  width: 1500px;
  height: 800px;
  border: 2px solid black;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  canvas {
    width: 256px;
    height: 256px;
    border: 2px solid black;
  }
`;

// 左侧
export const LeftWrapper = styled.div`
  width: 750px;
  height: 750px;
  border-right: 2px solid gray;
  padding-right: 5px;
  /* border-radius: 20px; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
`;

// 右侧大的组件
export const RightWrapper = styled.div`
  margin-left: auto;
  width: 800px;
  height: 750px;
  /* border: 2px solid black; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

export const StrokeShow = styled.div`
  margin: 0 20px;
  /* border: 1px solid red; */
  /* border-top: 1px solid #C0C0C0; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .text {
    font-size : 25px;
  }
`;

export const StrokeNameList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  border-bottom: #C0C0C0;
  width: 650px;
  border: 1px solid black;
  border-radius: 10px;
  border-bottom: 1px solid white;
`;

export const CharacterWrapper = styled.div`
  width: 650px;
  height: 600px;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const FunctionWrapper = styled.div`
  width: 300px;
  /* border: 1px solid blue; */
`;

export const HistoryWrapper = styled.div`
  margin: 20px;
  width: 250px;
  border: 1px solid gray;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Character = styled.div`
  width: 300px;
  height: 300px;
  border: 1px solid gray;
  border-radius: 5px;
  position: relative;
  canvas {
    width: 256px;
    height: 256px;
    margin: 22px;
    border: 0;
  }
  img {
    width: 256px;
    height: 256px;
    border: 1px solid red;
    margin: 22px;
    z-index: -1;
  }
`;


export const ButtonWrapper = styled.div`
  margin-top: 20px;
  width: 256px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  Button {
    margin: 5px;
  }
`;

export const StrokePicture = styled.div`
  width: 45px;
  height: 45px;
  border: 2px solid #1890ff;
  img {
    margin: 0;
    width: 100%;
    height: 100%;
  }
  
`;

export const CurrentStrokeWrapper = styled.div`
  margin: 20px;
`;

export const TitleTextSpan = styled.span`
  font-size: 25px;
`;


export const TitleTextSpan2 = styled.span`
  font-size: 20px;
`;

export const ContextRegularSpan = styled.span`
  font-size: 20px;
  font-weight: normal;
`;


export const ImageContainer = styled.div`
  width: 140px;
  height: 140px;
  border: 1px solid #1890FF;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const DataSetTitle = styled.div`
  margin-top: 20px;
  height: auto;
  width: 648px;
`;

// 是否已经标注
// 撤销笔画
// 跳转到哪一个字（记录个人标注的进度）+ 30/111