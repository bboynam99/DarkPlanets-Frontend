/* eslint-disable @next/next/no-img-element */

import { useState, useContext } from "react";
import { base64ToJson } from "./utils/constants";
import { addPropsToChildren } from "./utils/constants";
import { useContract } from "./utils/hooks/useContract";
import { AppContext } from "./utils/context/appContext";
import { DARK_PLANET_CONTRACT } from "./utils/constants";

import DARK_PLANET_ABI from "./utils/abis/darkplanet.json";

const SummonerIDInput = ({ children, placeholder, isClaim }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(undefined);
  const { languagePack, setAppState, appState } = useContext(AppContext);

  const summonerID = appState?.user?.summonerID;
  const getDarkPlanet = useContract(DARK_PLANET_CONTRACT, DARK_PLANET_ABI);

  const getDarkPlanetStats = async () => {
    if (getDarkPlanet) {
      setLoading(true);
      const {
        dxpRate,
        totalSupply,
        getDarkPlanetPoint,
        getDarkPlanettDxp,
        tokenURI,
        myStatus,
      } = getDarkPlanet;

      const userSummonerID = parseInt(summonerID, 10);
      const _dXPRate = await dxpRate();
      const _totalSupply = await totalSupply();
      const _myStatus = await myStatus(userSummonerID);
      const _tURI = await tokenURI(userSummonerID);
      const _dPlanetEXP = await getDarkPlanettDxp(userSummonerID);
      const _dPlanetPoint = await getDarkPlanetPoint(userSummonerID);

      let _tokenURI = base64ToJson(_tURI);
      let expRate = parseInt(_dXPRate);
      let _status = parseInt(_myStatus);
      let _totalSup = parseInt(_totalSupply);
      let _points = parseInt(_dPlanetPoint, 10);
      let _d_exp = parseInt(_dPlanetEXP, 10) / 1000000000000000000;

      setStats({
        ...stats,
        name: _tokenURI.name,
        description: _tokenURI.description,
        image: _tokenURI.image,
        exp: _d_exp,
        points: _points,
        status: _status,
        expRate: expRate,
        summonerID: userSummonerID,
        totalSupply: _totalSup,
      });
      setLoading(false);
      setErrorMsg("");
    } else {
      setErrorMsg(languagePack?.error?.not_login);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col w-full lg:w-1/2 px-5">
        <div className="w-full justify-center flex flex-row items-center space-x-5 z-50">
          <input
            type="text"
            value={summonerID}
            placeholder={placeholder}
            className="text-black px-3 py-2 rounded-md w-full outline-none"
            onChange={(e) => {
              const trimmed_val = e.target.value.replace(/[^0-9]/g, "");

              if (e.target.value.length === trimmed_val.length) {
                const user = {
                  ...appState.user,
                  summonerID: trimmed_val,
                };

                setErrorMsg("");
                setAppState({ ...appState, user });
              } else {
                setErrorMsg(languagePack?.error?.not_numeric);
              }
            }}
          />

          <button
            onClick={getDarkPlanetStats}
            disabled={!summonerID}
            className="px-10 bg-blue-500 rounded-md py-2 w-1/2 lg:w-1/3 xl:w-1/6"
          >
            {languagePack?.indexPage?.search_btn}
          </button>
        </div>
        {errorMsg && (
          <p className="text-red-500 py-2 text-left w-full">{errorMsg}</p>
        )}

        {isClaim &&
          (appState?.user?.summonerID ? (
            <button
              className="bg-blue-500 w-full py-2 rounded-md my-5 cursor-not-allowed"
              disabled
            >
              {languagePack?.indexPage?.claim_btn}
            </button>
          ) : (
            <button
              className="bg-blue-500 opacity-70 w-full py-2 rounded-md my-5 cursor-not-allowed"
              disabled
            >
              {languagePack?.error?.claim_error}
            </button>
          ))}
      </div>

      <div className="w-full flex flex-col items-center">
        {loading && <p className="text-xl">Loading...</p>}
        {!loading && (
          <div className="w-full flex flex-col items-center">
            {addPropsToChildren(children, {
              stats,
              getDarkPlanet,
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummonerIDInput;
