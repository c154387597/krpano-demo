import { useCallback, useMemo, useState } from "react";
import classnames from "classnames";
import {
  Autorotate,
  Events,
  HotSpot,
  Krpano,
  ROTATE_DIRECTION,
  Scene,
  View,
  ZOOM_ACTION,
} from "@kris7chan/krpano";
import { MouseHoldView } from "../../components";
import { ISceneProps } from "../../types";
import "./index.scss";

export default function HomePage() {
  const [currentMenu, setCurrentMenu] = useState(0);
  const [currentScene, setCurrentScene] = useState("scene1");
  const [hotspotHoverName, setHotspotHoverName] = useState("");
  const [autorotateEnable, setAutorotateEnable] = useState(false);
  const SCENE_LIST = useMemo<ISceneProps[]>(
    () => [
      {
        name: "scene1",
        thumbUrl:
          process.env.PUBLIC_URL + "/krpano/panos/scene1.tiles/thumb.jpg",
        previewUrl:
          process.env.PUBLIC_URL + "/krpano/panos/scene1.tiles/preview.jpg",
        imageTagAttributes: {
          type: "cube",
          tileSize: 512,
          multires: true,
        },
        images: [
          {
            tiledImageWidth: 1600,
            tiledImageHeight: 1600,
            url:
              process.env.PUBLIC_URL +
              "/krpano/panos/scene1.tiles/%s/l2/%v/l2_%s_%v_%h.jpg",
          },
          {
            tiledImageWidth: 768,
            tiledImageHeight: 768,
            url:
              process.env.PUBLIC_URL +
              "/krpano/panos/scene1.tiles/%s/l1/%v/l1_%s_%v_%h.jpg",
          },
        ],
        children: (
          <>
            <View
              hlookat={0}
              vlookat={0}
              fovType="MFOV"
              fov={120}
              maxPixelZoom={2}
              fovMin={70}
              fovMax={140}
              limitView="auto"
            />

            <HotSpot
              name="hotspot1"
              url={`${process.env.PUBLIC_URL}/images/guide.png`}
              atv={3}
              ath={-27}
              scale={0.3}
              edge="top"
              distorted={true}
              onClick={() => setCurrentScene("scene2")}
            />

            <HotSpot
              name="hotspot2"
              type="text"
              atv={-2}
              ath={-46}
              scale={0.5}
              edge="top"
              bg={false}
              distorted={true}
              onClick={() => alert("点击了 hotspot1")}
              onOver={() => setHotspotHoverName("hotspot2")}
              onOut={() => setHotspotHoverName("")}
            >
              <div
                className={`hotspot ${
                  hotspotHoverName === "hotspot2" && "active"
                }`}
              >
                <span>长城</span>
                <div className="pointer" />
              </div>
            </HotSpot>
          </>
        ),
      },
    ],
    [hotspotHoverName]
  );
  const MENUS = [
    {
      title: "场景1",
      scenes: SCENE_LIST,
    },
    {
      title: "xml场景",
      scenes: [
        {
          name: "scene2",
          thumbUrl:
            process.env.PUBLIC_URL + "/krpano/panos/scene2.tiles/thumb.jpg",
        },
      ],
    },
  ];

  const handleSceneClick = (name: string) => {
    setCurrentScene(name);
  };

  const handleMenuClick = (idx: number) => {
    setCurrentMenu(idx);
  };

  const handleView = (direction: ROTATE_DIRECTION) => {
    window.ReactKrpanoActionProxy?.rotateView(direction);
  };

  const handleZoom = (action: ZOOM_ACTION) => {
    window.ReactKrpanoActionProxy?.zoomView(action);
  };

  const handleAutoRotateOneRound = useCallback(() => {
    setAutorotateEnable(false);
    const count = window.ReactKrpanoActionProxy?.get("scene").count;
    const curIndex = window.ReactKrpanoActionProxy?.get(
      "scene[get(xml.scene)].index"
    );
    const nextScene = window.ReactKrpanoActionProxy?.get("scene").getItem(
      curIndex + 1 >= count ? 0 : curIndex + 1
    );
    setCurrentScene(nextScene.name);
    // 暂时未实现场景完成回调，先用setTimeout解决
    setTimeout(() => {
      setAutorotateEnable(true);
    }, 1000);
  }, []);

  return (
    <div className="home-page">
      <Krpano
        className="krpano"
        xml={`${process.env.PUBLIC_URL}/krpano/scene.xml`}
        webvrUrl={`${process.env.PUBLIC_URL}/krpano/plugins/webvr.xml`}
        currentScene={currentScene}
        passQueryParameters={true}
      >
        <Autorotate enabled={autorotateEnable} />
        <Events onAutoRotateOneRound={handleAutoRotateOneRound} />

        {[...SCENE_LIST].map((sc) => (
          <Scene key={sc.name} {...sc} />
        ))}
      </Krpano>

      <div className="scene-panel">
        <div className="scene-panel__menu">
          {MENUS.map((sc, idx) => (
            <div
              key={sc.title}
              className={classnames([
                "scene-panel__menu__item",
                idx === currentMenu && "active",
              ])}
              onClick={handleMenuClick.bind(undefined, idx)}
            >
              {sc.title}
            </div>
          ))}
        </div>

        <div className="scene-panel__list">
          {MENUS[currentMenu].scenes.map((sc) => (
            <div
              key={sc.name}
              className={`scene-panel__list__item ${
                sc.name === currentScene ? "active" : ""
              }`}
              onClick={handleSceneClick.bind(undefined, sc.name)}
            >
              <img src={sc.thumbUrl} alt={sc.name} />
            </div>
          ))}
        </div>
      </div>

      <div className="toolbar">
        <MouseHoldView
          onHold={handleView.bind(undefined, ROTATE_DIRECTION.LEFT)}
        >
          <button>←</button>
        </MouseHoldView>
        <MouseHoldView
          onHold={handleView.bind(undefined, ROTATE_DIRECTION.RIGHT)}
        >
          <button>→</button>
        </MouseHoldView>
        <MouseHoldView onHold={handleView.bind(undefined, ROTATE_DIRECTION.UP)}>
          <button>↑</button>
        </MouseHoldView>
        <MouseHoldView
          onHold={handleView.bind(undefined, ROTATE_DIRECTION.DOWN)}
        >
          <button>↓</button>
        </MouseHoldView>
        <MouseHoldView onHold={handleZoom.bind(undefined, ZOOM_ACTION.IN)}>
          <button>+</button>
        </MouseHoldView>
        <MouseHoldView onHold={handleZoom.bind(undefined, ZOOM_ACTION.OUT)}>
          <button>-</button>
        </MouseHoldView>
        <button
          className={classnames(autorotateEnable && "active-btn")}
          onClick={() => setAutorotateEnable(!autorotateEnable)}
        >
          360°
        </button>
        <button
          onClick={() => {
            window.ReactKrpanoActionProxy?.call("webvr.enterVR();");
          }}
        >
          vr
        </button>
      </div>
    </div>
  );
}
