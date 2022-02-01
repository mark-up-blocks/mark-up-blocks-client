# [Mark up blocks](https://www.markupblocks.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2cddd61c-308f-4560-a0e3-0d038df383f8/deploy-status)](https://app.netlify.com/sites/markupblocks/deploys)

| ![site-cover](https://user-images.githubusercontent.com/60309558/139607714-8e3e7762-f57c-44ae-9c66-c03e9b066523.png) |
|:--:|
| *google 챌린지 첫 번째 stage layout 화면* |

- 왼쪽 하단에 보이는 태그블록들을 오른쪽 하단의 뷰어로 옮기면서 오른쪽 상단에 보이는 페이지를 완성하는 게임입니다.
- 직접 태그를 옮기면서 HTML의 계층 구조를 눈으로 확인할 수 있습니다.

<br />

# Contents
1. [주요 기능](#주요-기능)
2. [프로젝트 동기](#프로젝트-동기)
3. [기술스택](#기술스택)
4. [작업기간](#작업기간)
5. [배포](#배포)
6. [주요 구조 설계 과정](#주요-구조-설계-과정)
   1. [트리 형태의 챌린지 데이터](#트리-형태의-챌린지-데이터)
   2. [여러 challenges를 오갈 때 기존 데이터를 보존하려면](#여러-challenges를-오갈-때-기존-데이터를-보존하려면)
   3. [문제와 선택지를 클라이언트에서 생성하는 시스템](#문제와-선택지를-클라이언트에서-생성하는-시스템)
   4. [nested drop과 sortable drag 동시 처리](#nested-drop과-sortable-drag-동시-처리)
   5. [modal로 보여줄 데이터를 관리하는 notice reducer](#modal로-보여줄-데이터를-관리하는-notice-reducer)
7. [프로젝트를 마친 소감](#프로젝트를-마친-소감)

<br />

# 주요 기능

![tutorial_renewal](https://user-images.githubusercontent.com/60309558/139607223-52b0bf8e-ca64-4603-818f-4a5238804bee.gif)

- 드래그 앤 드롭으로 태그블록을 옮겨서 맞는 위치를 찾아주는 형식입니다.
- 블록을 클릭하거나 호버하면 해당 블록의 스타일을 미리보기로 확인할 수 있습니다.
- 블록을 오른쪽 하단의 뷰어로 옮기면 왼쪽 상단에 해당 요소가 표시됩니다.
- 뷰어에서도 블록을 이동할 수 있으며, 자식 태그가 있다면 이동 시 자식 태그도 포함하여 이동됩니다.
- 모든 블록이 맞춰지면 완료 메시지가 출력되며 다음 스테이지로 넘어갈 수 있습니다.
- 스테이지가 완료되지 않아도 우측 상단의 메뉴바를 이용해 다른 스테이지나 챌린지로 이동할 수 있으며, 이동 후 돌아오더라도 기존 데이터는 유지됩니다.
- URL로 특정 스테이지에 바로 접근할 수 있습니다.

<br />

# 프로젝트 동기

Mark up blocks는 로그인 없이 이용할 수 있는 서비스를 고민하다 떠오른 아이디어입니다. 이전 팀 프로젝트에서 로그인 후 이루어지는 소셜 기능에 집중했던 터라 새로운 도전을 해보고 싶었습니다.

팀원분의 소개로 알게 된 flexboxfroggy를 즐겁게 이용한 경험이 있기에 비슷한 서비스를 고려하다가, CSS 관련 서비스(flexboxfroggy, css diner, 9기분의 where are you 등)는 여럿 있기에 상대적으로 드문 주제인 HTML을 선택했습니다.

HTML 중에서는 태그 종류를 익힌 후 찾아오는 어려움인 계층 구조에 집중했습니다. 처음 HTML을 배울 때 태그 간의 부모 자식 관계가 낯설었던 기억을 되살려, 자식을 직접 추가해보고 결과를 눈으로 확인한다는 컨셉을 잡았습니다.

초기에는 에디터를 제공해서 유저가 직접 코드를 입력할 수 있는 인터페이스를 구상했습니다. 하지만 타겟 유저가 프로그래밍 입문자라는 점을 고려할 때, 직접 타이핑을 하게 되면 인덴팅이나 태그 클로징 등 다른 어려움을 겪을 가능성이 있었습니다. 진입장벽을 낮추고 주제인 계층 구조에만 집중할 수 있는 방식을 고민하다가 현재의 드래그 앤 드롭 기반 인터페이스로 정착하였습니다.

<br />

# 기술스택

### Client

- React
    - React DnD
    - Styled-Component
- Redux
- Jest

### Server

- Node.js
- Express
- MongoDB
- Mongoose
- Jest

### 해당 기술 스택 선정 이유

- React: 각 tag에 해당하는 element를 효과적으로 렌더링하기 위해 선택하였습니다.
    - createElement: 화면에 표시되는 태그블록 데이터는 HTMLViewer에 드롭되기 전까지는 객체로 저장되어 있다가, DOM에 렌더링이 필요한 시점에 React.createElement를 거쳐 실제 엘리먼트가 됩니다. createElement에는 자식 엘리먼트를 인자로 넘길 수 있어 태그블록 데이터를 재귀적으로 처리할 수 있는 특성이 유용하게 사용되었습니다.
    - 효율적인 비교 알고리즘: 블록이 드래그되면서 상태변화가 자주 일어나는데, 필요한 부분만 리렌더링될 수 있도록 탁월한 최적화를 제공합니다.
- Styled-Component: 대안인 sass보다 익숙해서기도 하지만, 자식 엘리먼트들을 재귀적으로 처리할 때 더 직관적이라고 생각해 선택하였습니다.
- React Dnd: 드래그 앤 드롭을 구현하기 위해 사용했습니다.
    - 인터페이스가 hook 형태라는 점(useDrag, useDrop) 문서가 체계적으로 정리되어 있고, 구현에 필요한 기능(드래그 예시와 item 정보를 받아오는 예시, sortable 예시) 대부분에 대한 예시가 상세하게 제공되고 있다는 점, 지속해서 업데이트되고 있다는 점 등을 고려해 선택했습니다.
    - 유사한 인지도의 react-beautiful-dnd는 이름에서 나타나듯이 주요 강점이 predefined effects인데, 애니메이션 효과가 크게 필요하지 않은 프로젝트여서 선택하지 않았습니다.
    - 가장 높은 인지도를 가지고 있는 react-draggable은 HOC 형태의 인터페이스를 제공하고, 터치 지원 관련 문서가 상대적으로 적어 선택하지 않았습니다.
- Redux: 변동이 잦은 태그블록들의 상태관리를 위해 사용하였습니다.
- MongoDB: 데이터 저장 시 트리 구조의 특성을 반영하기 위해 사용하였습니다.

### 작업 중 배제된 기술 스택

- StoryBook
    - 기획 당시 태그블록 컴포넌트를 작성하는 작업이 볼륨이 크다고 판단, 충돌 없이 작성하려면 컴포넌트 관리 차원에서 라이브러리의 도움을 받는 것이 좋겠다고 판단하였습니다. 하지만 실제로는 대부분의 과정에서 스토리북 없이도 충분히 작성이 가능했고, 스토리북 사용에서 크게 이득을 보는 협업 상황도 아니기 때문에 배제하였습니다.

<br />

# 작업기간

### 기획 (1주차)

- [mock up](https://www.figma.com/file/wJwq96UfEpiqS71gIYmVUH/Mark-up-blocks?node-id=0%3A1)
- [schema](https://github.com/orgs/mark-up-blocks/projects/1)
- [Task Card](https://github.com/orgs/mark-up-blocks/projects/1)

### 개발 및 배포 (2, 3주차)
- flow
  - 브랜치를 기준으로 각 feature에 해당하는 브랜치를 생성 및 작업 후 merge하는 방식으로 진행하였습니다.
- 기능 구현
    - element tree 렌더링 및 자식 추가, 변경
    - nested drag & drop interface
    - stage 이동
- 테스트, 문서 작성
  - client
    - reducer별 테스트를 포함해 주요 기능 위주로 테스트를 작성하였습니다.
    - 핵심 기능인 드롭 시 데이터 처리 로직은 challenge reducer의 addChildTree에 포함되어 있습니다.
  - server
    - 엔드포인트별 테스트와 자체적으로 작성한 schema validator에 대한 테스트를 작성하였습니다.
- 피드백 및 추가 기능 반영

<br />

# 배포

### Client

- Netlify

### Server

- AWS elastic beanstalk

<br />

# 주요 구조 설계 과정

작업을 하다 보면 많은 이슈가 발생합니다. 때때로는 전체 구조에까지 영향을 미치는 중대 이슈를 만나기도 합니다. 어떤 어려움을 겪었고, 어떻게 해결하게 되었는지, 선택에 따라오는 득과 실은 무엇이었는지 설명합니다.

<br />

## 트리 형태의 챌린지 데이터

### 문제로 사용할 페이지의 Document Tree

  프로젝트의 주요 아이디어는 '목표 페이지를 그대로 따라 만든다'입니다. 그러려면 클라이언트 단에서 유저에게 완성된 페이지를 렌더링해주어야 하고, 서버가 페이지 데이터를 전달해주어야 합니다.

  이는 돔 '트리'에 대한 데이터이기 때문에 최종 데이터는 트리 형태여야 했고, mongodb는 BSON 형식의 유연한 데이터 구조를 지원하기 때문에 전체 데이터를 트리 형태로 저장하는 것도 충분히 가능했지만, 실제 데이터를 트리 형태로 저장하자니 아래와 같은 이슈가 있었습니다.

### Difficulties

1. deeply nested 데이터는 조회 및 편집이 어렵습니다.
  - 첫 데이터를 작성하던 시점에는 트리 최하단 노드를 편집해야 하는 경우가 빈번했습니다. 챌린지 단계에 따라 최대 5단계 이상 중첩된 데이터를 확인하려면 복잡한 쿼리를 쓰거나, 아틀라스에서 더보기 버튼을 계속 클릭해야 해 단순한 조회 작업이 필요 이상으로 복잡해졌습니다. 단순히 태그 하나의 속성을 변경하는 작업에 품이 너무 많이 들었습니다.

2. 속성이 모두 같은 태그더라도 다른 객체이므로 다른 ObjectId를 갖게 됩니다.
  - 배열 같은 경우 모든 속성이 같은 태그가 여럿 존재할 수 있습니다. 아래 예시에서 두 li 태그는 자식 요소만 다르고 동일한 속성을 가집니다.

```jsx
<ol>
  <li class="same-li-tag">
    <p>child1</p>
  </li>
  <li class="same-li-tag">
    <p>child2</p>
  </li>
</ol>
```

  하지만 이 데이터를 트리 형태로 저장하게 되면 아래처럼 li을 두 번 생성해야 하고, 각각 별도의 ObjectId를 부여받게 됩니다.

```jsx
{
  "ObjectId": "olId",
  "tagName": "ol",
  "children": [
    {
      "ObjectId": "li1Id", // 첫 번째 li
      "tagName": "li",
      "children": [...],
    },
    {
      "ObjectId": "li2Id", // 두 번째 li
      "tagName": "li",
      "children": [...],
    }
  ]
}
```

  이 경우 태그를 '배치'할 수 있는 인터페이스를 제공하는 과정에 문제가 생깁니다. 유저 입장에서 첫 번째 li와 두 번째 li은 같은 태그기 때문에 이 둘의 순서가 달라져도 같은 결과를 보장해야 하는데, 둘의 ObjectId가 달라 비교가 어렵기 때문입니다.

  속성을 재귀적으로 탐색하면서 직접 비교할 수도 있겠지만 id 비교보다 비효율적이기도 하고, 무엇보다 비교 시 속성을 재귀적으로 탐색해야 한다는 것은 수정 시에도 동일한 작업을 거쳐야 한다는 뜻(동일 레벨의 데이터를 모두 재귀 순회해야 한다)이므로 실수가 생기기 쉬운 구조라고 생각되었습니다.

### Solution

1. 데이터 조회 및 편집이 어려운 문제는 저장 시 트리를 해체해서 평면적으로 저장하고, 요청 시 populate를 거쳐 트리 구조를 만들어 제공하는 방식으로 해결했습니다.

2. 속성이 같은 태그의 다른 ObjectId 문제는 속성을 관리하는 레이어를 분리해서 해결했습니다.
  - 태그를 구성하는 정보(속성)을 관리하는 TagBlock과 관계성을 관리하는 BlockTree로 나눈 다음, BlockTree에서 자신의 태그 정보를 가지고 있는 TagBlock의 ObjectId를 참조하게 했습니다.

```jsx
interface TagBlock {
  tagName: string;
  isContainer: boolean;
  property: {};
}

interface BlockTree {
  block: TagBlock;
  childTrees: BlockTree[];
}
```

#### Gains
- 같은 속성의 태그는 참조로 처리할 수 있게 되면서 중복 데이터가 사라졌습니다.
- 채점 시 TagBlock ObjectId만 비교할 수 있게 되어 채점 로직이 간결해졌습니다.
- BlockTree의 ObjectId는 고유한 값으로 유지되니, 기존의 장점인 리액트에서 map을 돌릴 때 사용되는 key값이 보장된다는 점 또한 그대로 유지됩니다.

#### Losses
- 데이터 요청 시 서버에서 populate 과정을 거쳐야 해서 처리 시간이 늘어났습니다.
  - 다만 한번 작성되고 나면 자주 수정되는 데이터가 아니어서, 이후 완성된 트리 데이터를 캐싱해두는 방식으로 어느 정도 해결할 수 있지 않을까 합니다.
- 데이터 생성 로직이 복잡해졌습니다.
  - 트리 구조일 때는 최상위 태그부터 차례차례 작성하면 되었는데, 개별 태그를 생성하고 ObjectId를 부모의 childTrees에 추가해주는 작업이 추가되었습니다. 다만 전체적으로 봤을 때 중복 처리 로직이 간결해지면서 생긴 트레이드오프니, 수용 가능한 수준이라고 생각됩니다.

<br />

## 여러 challenges를 오갈 때 기존 데이터를 보존하려면

  기획 당시에는 challenges 없이 구글 페이지 챌린지가 컨텐츠의 끝이어서 그에 맞춰 구조를 작성했습니다. 진행 중인 데이터가 최상단에 있고, 전체 데이터(아래 rootChallenge의 data 필드)를 포함하고 있는 형식입니다. 초기의 client redux store의 challenge state 스키마는 아래와 같았습니다.

```jsx
{
  challengeId: "",
  title: "",
  tagBlockContainer: null,
  boilerplate: null,
  answer: null,
  isCompleted: false,
  stageInfo: {
    rootChallenge: {
      name: "",
      _id: "",
      data: null,
    }
  }
}
```

  이 상태에서는 유저가 현재 진행 중인 단계를 변경하면, 먼저 rootChallenge의 data를 순회 → 기존 단계 탐색 → 기존 단계의 data 자리에 현재 data(tagBlockContainer, boilerplate, answer 3종이 하나로 통합된 과정은 바로 다음 이슈에서 다룹니다.) 보관 과정을 거쳤습니다. 이후 선택 단계 탐색 → 최상위에 있던 data를 선택 단계 데이터로 교체합니다.

### Difficulties
1. 트리 중 일부를 별도로 보관하면 필연적으로 중복이 발생합니다.
  - 전체 데이터가 트리 형태기 때문에 현재 데이터를 별도로 상단에 보관하면 중복이 생길 수밖에 없습니다. 이런 비효율적인 방식으로 작성된 것은 당시 로직이 작업 순서의 영향을 받았기 때문이었습니다. 구현 당시 세부 챌린지 작성 → 동작하는지 확인 → 스테이지 이동 로직 추가 순서대로 작업했고, 스테이지 이동 로직 추가 시에 기존의 구조를 변경하지 않은 채 작성했더니 이런 방식이 되었습니다.

2. 확장을 위해 레이어를 추가하게 되면 depth가 지나치게 깊어집니다.
  - 작업을 하다 보니 현재 제공 중인 google 외에도 다른 challenge들을 더 추가하고 싶다는 생각이 들었습니다. 여러 개의 challenge를 다룰 수 있도록 확장하기 위해서는 구조를 변경해주어야 했습니다. 유저가 challenge를 선택할 수 있도록 목록 형태로 보여주려면 배열 형태가 최적이라고 판단되었으나, 실제 challenge를 배열로 확장하려니 중첩이 심해 처리하기 어려웠습니다.

### Solution

  아래는 현재의 챌린지 스키마입니다. 최상단의 데이터가 사라지고, 배열과 선택 인덱스만 남아있는 형태입니다.

```jsx
{
  name: "challenge",
  initialState: {
    isListLoading: true,
    isChallengeLoading: false,
    selectedIndex: 0,
    challenges: [tutorialData],
  }
}
```

  1. 데이터 중복 저장 문제는 별도로 저장해두던 stage를 없애고, reducer 내부에 있던 stage 검색 로직을 selector로 분리하면서 해결하였습니다.
  - 기존에 현재 데이터를 별도 보관하고 있던 것은 유저에게 인터페이스를 보여줄 때 바로 가져올 수 있어야 하기 때문이었습니다. 하지만 stage 이동 시에 전체 트리를 순회해서 기존 데이터를 확인할 수 있다면, 현재 선택한 stage 관련 정보를 처리하는 모든 경우에도 마찬가지로 처리할 수 있다는 뜻이므로, reducer에서만 이용하던 탐색 로직(selector)을 컴포넌트 단에서도 이용할 수 있게 하면서 해결되었습니다.

  2. 위 문제가 해결되니 전체 challenge 데이터가 최상단에 오게 되어, depth가 지나치게 깊어졌던 문제도 자연스레 해결되었습니다.
  - challenge 최상단에는 진행 중인 stageId를 갖고 있게 해 현재 상태 저장 문제도 해결하였습니다.

#### Gains

- 전체 데이터 구조가 단순해져 처리가 수월해졌습니다.

#### Losses

- 현재 데이터를 별도로 갖고 있지 않아 탐색에 시간이 추가로 소요됩니다.
  - 위에서 언급한 selector는 BFS 방식으로 탐색 대상을 찾을 때까지 완전 탐색을 진행합니다. 다만 실제 탐색 과정을 확인해본 결과, 연산 자체가 O(n)이긴 하지만 n의 최댓값이 아무리 많아야 100을 넘지 않는 전체 stage 개수기 때문에 데이터를 중복으로 관리하는 것보다 매번 탐색하는 것이 합리적이라고 판단하였습니다.

<br />

## 문제와 선택지를 클라이언트에서 생성하는 시스템

  직전 이슈에서 언급했던, 기존 구조에서 tagBlockContainer, boilerplate, answer를 하나로 통합하는 과정입니다.

  처음 구조는 일반적인 퀴즈의 구조인 문제, 선택지, 답 형태를 띠었습니다. 아래와 같이 답(answer), 문제(boilerplate), 선택지(tagBlocks)를 각각 가지고 있는 구조입니다. 처음 데이터 생성 시, answer tree를 작성하고, 그 과정에서 생성한 TagBlock값을 별도로 배열에 저장한 다음 스키마에 추가하는 방식이었습니다. 아래는 초기의 mongodb challenge schema입니다.

```jsx
{
  _id: String;
  title: String;
  tagBlocks: TagBlock[];
  boilerplate: BlockTree;
  answer: BlockTree;
}
```

### Difficulties

1. 바로 위 이슈와 마찬가지로 중복 데이터 문제가 발생합니다.
  - TagBlock 자체는 모두 참조값이므로 db상으로는 크게 중복이 없어 보이지만, 데이터를 전송하는 서버의 입장에서는 populate된 tagBlocks들의 값은 이미 answer의 자식 중 하나에 담겨있는 정보여서 중복이 됩니다.
  - tagBlocks에서 참조하고 있는 값은 관계성이 없는 단일 태그기 때문에, 이 정보만으로는 클라이언트에서 해당 태그의 자식까지 포함해서 렌더링하는 경우를 처리할 수 없었습니다. (header라면 블록을 옮겼을 때 header 내부 구성요소인 로그인 버튼 등을 보여주어야 하기 때문입니다.)
  - 이 문제를 해결하려면 별도의 속성을 만들고, 클라이언트에서 TagBlock의 해당 속성과 ObjectId를 기준으로 answer의 트리를 탐색해서 자식으로 추가해주어야 했습니다. 데이터를 가능한 완성된 형태로 제공하기 위해 서버에서 사전에 작업해두는 것인데, nested 같은 경우는 클라이언트에서 따로 처리해주어야 하니 당초 목적에 부합하지 않았습니다.

2. subChallenge들도 각자 자신의 tagBlocks와 boilerplate를 갖고 있어야 하므로 데이터가 복잡해집니다.

기존 google 페이지의 최상위 stage인 layout은 아래와 같은 형태였습니다.

```jsx
{
  ObjectId: "ObjectId",
  title: "layout",
  tagBlocks: ["header TagBlock ref", "main TagBlock ref", "footer TagBlock ref"],
  boilerplate: "BlockTree ref",
  answer: "BlockTree ref"
}
```

  마찬가지로 header, main, footer도 자신의 tagBlocks와 boilerplate를 갖고 있어야 하니 BlockTree가 아니라 별도의 challenge로 만들어주어야 하는 이슈가 있었습니다. BlockTree와 ObjectId를 공유하는 challenge를 만들고 별도의 엔드포인트로 관리 중이었지만 필요 이상으로 복잡했습니다.

### Solution

- 문제와 선택지 데이터 생성 작업을 데이터 생성 단에서 클라이언트로 이동하고, 데이터 생성 단에서는 answer 데이터만 작업하도록 수정해 중복 문제와 복잡한 데이터 문제가 해결되었습니다.
  - 여기서도 아이디어는 클라이언트에서 nested 경우를 처리할 수 있다면, 전체 데이터도 처리할 수 있겠다는 데에서 왔습니다. 전체 데이터가 트리 형태고, 실제 문제 데이터는 완성된 트리를 해체하기만 하면 만들어지기 때문에 연산 부하가 큰 로직이 아니었습니다. 오히려 tree의 내부 데이터인 stage를 별도의 엔드포인트로 분리해서 생긴 손실이 더 컸다는 사실을 이후 깨달았습니다.

#### Gains

 - 서버에서 별도의 엔드포인트로 관리하던 subChallenge(stage)가 필요 없어지고, challenge 데이터 구조도 단순해졌습니다.
 - TagBlock 추출 로직이 클라이언트로 옮겨오면서, 같은 로직을 기반으로 하는 Reset 기능 제공이 수월해졌습니다.

#### Losses
  - 클라이언트에서 처리해야 하는 연산이 늘어났습니다. 하지만 각각의 스테이지에서 처리해야 할 데이터는 그리 많지 않아서(스테이지 단의 depth는 깊어야 3단계 정도입니다.) 소요 시간이 유의미하게 늘어나지는 않았습니다.

<br />

## nested drop과 sortable drag 동시 처리

  드래그 앤 드롭이 여러 조건에서 모두 작동하도록 구현하는 과정에서 고민한 내용입니다.

### Difficulties

  - 요소 하나가 여러 가지 드롭 이벤트를 처리해야 합니다.
    - 뷰어에 부모 태그가 드롭되고 나면, 드롭된 태그의 자식에 드롭할 수 있는 위치가 추가되어야 합니다. 동시에 자식으로 드롭하는 것이 아니라, 단순히 순서를 바꾸는 드롭도 처리해야 합니다. 유저에게 드롭 가능한 영역을 표시해줄 때 이 둘을 어떻게 다르게 보여줄 것인가가 난제였습니다.

### Solution

  - 요소 자체를 드롭 영역으로 삼는 대신, 노션과 같은 가이드라인 형식을 추가하고 이 가이드라인을 드롭 영역으로 삼아 해결했습니다.

  React DnD sortable 예제를 살펴보니 Drag와 Drop을 함께 감싸서 해당 요소 자리에 바로 드롭할 수 있게 되어 있었습니다. 하지만 한 태그가 여러 개의 드롭 장소를 제공해야 하는 제 상황에서는 맞지 않아, 노션의 드롭 가이드라인 표시 방식을 채택했습니다.

  ![nested_drop_renewal](https://user-images.githubusercontent.com/60309558/139605742-83ec1ee9-9402-4249-8c14-41891b71dd5b.gif)

  부모 요소라면 기본적으로 자식에 해당하는 드롭 가이드라인을 갖고 있도록 하고, 또 뷰어에 있는 드래그 가능한 모든 요소에 하나씩 드롭 가이드라인을 주어서 드롭 이벤트 발생 시 기존 요소의 인덱스를 함께 넘겨주는 방식으로 해결하였습니다. 부모 요소는 2줄로 렌더링되기 때문에 그사이에 인덴팅을 포함해 자식 드롭 가이드라인을 보여주고, 일반적인 위치 변경 가이드라인은 동일 레벨 요소와 같은 라인으로 표시되도록 했습니다.

#### Gains

 - 유저에게 자식 드롭과 순서변경 드롭을 시각적으로 다르게 표현해줄 수 있습니다.

 - 상대적으로 복잡한 순서 변경 로직(예제에서는 화면상의 좌표를 계산합니다)을 인덱스로 간단히 처리할 수 있게 되었습니다.

#### Losses

  - 드롭 이벤트 발생 시 기존 containerId, 옮길 containerId, 선택한 itemId, 옮길 container의 몇 번째로 들어갈지에 대한 index 등을 모두 넘겨야 해서 처리 데이터가 많아졌습니다. 이 부분을 개선할 방안은 아직 고민 중입니다.

<br />

## modal로 보여줄 데이터를 관리하는 notice reducer

  클라이언트에서는 크게 2종류의 데이터가 필요합니다. 메뉴를 구성하는 데 필요한 전체 challenges 목록과 특정 challenge를 선택했을 때 필요한 상세 데이터입니다. 상세 데이터를 처음부터 가져올 필요는 없기 때문에, 처음에는 최초 접속 시 title과 ObjectId 정보가 담긴 challenges 목록 패치 → 튜토리얼 로딩 → 이후 필요할 때 challenge 데이터 패치 순으로 진행했습니다.

  그런데 모바일로 접속해보니 challenge를 가져오지도 않았는데 초반 튜토리얼이 로딩되기까지 시간이 오래 걸렸습니다. 사실 튜토리얼은 클라이언트 단에서 가지고 있는 데이터라서 서버 요청과 상관없이 보여줄 수 있는데도, challenges 패치를 기다리느라 시간이 오래 걸린 것입니다.


### Difficulties

1. Loading 모달을 App에서 처리하기 때문에 모든 컴포넌트 렌더링이 차단됩니다.
  - 튜토리얼만 Loading 조건 바깥으로 빼자니, 라우팅 처리를 위한 Switch 블록 바깥으로 벗어나게 돼 관리가 어려워집니다.

2. 완료 모달과 Loading 모달이 동시에 렌더링되어 겹치게 됩니다.
  - 이를 해결하려면 모두 조건부 렌더링으로 연결해야 하는데, hasError > isLoading > isDone 3중첩 구조는 과하게 복잡하다고 생각되었습니다.

  ![multiple-modal](https://user-images.githubusercontent.com/60309558/138037376-589ff7c0-a669-4b3d-a26a-e01863205ca0.gif)

  *UI 변경 전 해결된 이슈로, 위의 이미지는 이전 UI입니다.*

### Solution
1. App 컴포넌트에서 관리하던 error, loading 등의 상태를 notice reducer로 분리하고, Loading 모달이 필요한 시점에 각 컴포넌트에서 디스패치하는 방식으로 변경하였습니다.
    - 처음 접속시 App에서는 challenges를 fetch하지만, 바로 모달을 띄우는 대신 로딩 상태만 저장해둡니다. 이후 데이터가 필요한 시점에 로딩 여부를 확인하고, 아직 로딩 중이라면 모달 출력을 위한 디스패치 요청을 보냅니다. App에서는 notice reducer의 state에 따라 나머지 렌더링을 차단합니다.

2. 여러 모달을 렌더링하는 대신, 하나로 관리하면서 중첩 문제가 해결되었습니다.
    - 새로운 액션이 디스패치되면 기존의 모달을 덮어쓰게 돼 한번에 렌더링되는 모달은 하나뿐이 됩니다.

#### Gains

- 로딩 상태 변경 시점과 로딩 모달 출력 시점이 분리되면서, 해당 데이터가 필요하지 않은 부분까지 블로킹되는 현상이 해소되었습니다. 결과적으로 유저가 튜토리얼을 진행하는 동안 challenges 목록을 가져오는 백그라운드 패치가 가능해졌습니다.

#### Losses

 - 상태관리용 액션을 한 번 더 디스패치하게 되었습니다. 특히 로딩 상태 변경 시점과 로딩 모달 출력 시점이 동일한 경우에는 sequential dispatch가 발생하는데, 이 부분은 아직 개선의 여지가 있습니다.

<br />
<br />

# 프로젝트를 마친 소감

- 프로젝트를 시작하기 한참 전에, 퍼스널 멘토님께서 프로젝트에서 적합한 자료구조를 판단하고 도입해보면 좋다는 조언을 해주신 적이 있습니다. 좋은 아이디어다 싶으면서도 어떤 주제를 해야 가능할까 고민을 많이 했었는데 결국 트리에 집중한 프로젝트를 하게 되었습니다. 적어도 트리만큼은 이전보다 많이 알게 된 것 같아 뿌듯합니다. 이후 다른 자료구조도 다뤄보고 싶습니다.
- 처음에 구상한 것은 굉장히 심플한 프로젝트였습니다. 핵심 기능을 충분히 구현할 수 있을지 확신이 들지 않아서 기획 당시 굉장히 기본적인 기능만 포함했는데, 큰 산을 넘고 유저 입장에서 다시 생각해보니 필요한 부분이 예상외로 많았습니다. 일정에 여유 되는 만큼만 반영한지라 남은 아이디어들이 아쉽습니다. 진작 알았으면 더 잘 할 수 있었을 텐데 싶기도 합니다만, 그 과정에서 배워서 알게 된 것이니 기쁘게 생각하고 아쉬운 부분은 차근차근 개선해나가야겠습니다.
- 혼자서 구조를 곱씹으면서 팀 프로젝트의 데일리 스크럼이 종종 그리웠습니다. 직면한 문제 자체는 검색을 통해 해결할 수 있었지만, 동료들과 여러 관점을 공유하고 토론하면서 얻었던 에너지를 대체하기는 쉽지 않았습니다. 이후에도 바코에서 배운 소중한 경험을 잊지 않고, 시너지를 낼 수 있는 좋은 동료가 될 수 있도록 노력해야겠습니다.
