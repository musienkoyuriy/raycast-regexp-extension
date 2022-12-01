import { useEffect, useState } from "react";
import { Icon, List, LocalStorage } from "@raycast/api";
import { MappedExpression, ZipCodeResponse } from "../types";
import { ExpressionItemActions } from "../searchRegexp";
import got from "got";
import { capitalize } from "../utilities";

const ZIP_CODES_BASE_URL = "https://i18napis.appspot.com/address/data/";
const ZIP_CODES_STORAGE_TOKEN = "ZIP_CODES";

type ZipCodesMap = {
  [key: string]: Record<string, string>;
};

export default function ZipCodesList({ expressions }: { expressions: MappedExpression[] }): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [zipCodes, setZipcodes] = useState<MappedExpression[]>(expressions);
  const [filteredZipCodes, setFilteredZipCodes] = useState<MappedExpression[]>([]);
  const [search, setSearch] = useState<string>("");
  const promises: Promise<any>[] = [];

  useEffect(() => {
    (async () => {
      const zipCodesFromStorage = JSON.parse((await LocalStorage.getItem(ZIP_CODES_STORAGE_TOKEN)) || "[]");

      if (zipCodesFromStorage.length > 0) {
        setZipcodes(zipCodesFromStorage);
        return;
      }

      setLoading(true);

      expressions.forEach(
        (expression: MappedExpression) => promises.push(got(`${ZIP_CODES_BASE_URL}${expression.name}`))
      );

      const zipCodesApiResponses = await Promise.all(promises);
      const mappedResponse: ZipCodesMap = zipCodesApiResponses.reduce((acc: ZipCodesMap, curr) => {
        let unserializedResponse;
        try {
          unserializedResponse = JSON.parse(curr.body) as ZipCodeResponse;
        } catch (err) {
          unserializedResponse = {} as ZipCodeResponse;
        }
        const country = capitalize(unserializedResponse.name || "");
        const zipCode = unserializedResponse.key;

        return {
          ...acc,
          [zipCode]: { country },
        };
      }, {});

      setZipcodes(
        expressions.map((expression) => ({
          ...expression,
          description: mappedResponse[expression.name]?.country || "",
        })) as unknown as MappedExpression[]
      );
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setFilteredZipCodes(
      zipCodes.filter((zipCode) => {
        return (
          zipCode.description?.toLowerCase().includes(search.toLowerCase()) ||
          zipCode.name?.toLowerCase().includes(search.toLowerCase()) ||
          search.trim() === ""
        );
      })
    );
  }, [zipCodes, search]);

  useEffect(() => {
    setFilteredZipCodes(zipCodes);

    (async () => {
      await LocalStorage.setItem(ZIP_CODES_STORAGE_TOKEN, JSON.stringify(zipCodes));
    })();
  }, [zipCodes]);

  return (
    <List isLoading={loading} onSearchTextChange={setSearch}>
      {!loading &&
        filteredZipCodes.map((item: MappedExpression) => {
          return (
            <List.Item
              key={item.id}
              title={item.name}
              icon={Icon.BarCode}
              subtitle={item.description}
              accessories={[{ text: `${item.displayName}` }]}
              actions={<ExpressionItemActions regexp={item.regexp!} />}
            />
          );
        })}
      )
    </List>
  );
}
