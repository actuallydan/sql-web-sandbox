import { useState, useEffect, type ChangeEvent } from "react";
import { API } from "@/utils/sqlite";
import { useExecuteQuery } from "@/hooks/useExecuteQuery";

export default function SidebarImport() {
  const executeQuery = useExecuteQuery();

  const [state, setState] = useState<{
    json: File | null;
    csv: File | null;
    sql: File | null;
  }>({
    json: null,
    csv: null,
    sql: null,
  });

  useEffect(() => {
    if (state.json) {
      importJSON(state.json);
    }
  }, [state.json]);

  useEffect(() => {
    if (state.csv) {
      importCSV(state.csv);
    }
  }, [state.csv]);

  useEffect(() => {
    if (state.csv) {
      //   importSQL(state.sql);
    }
  }, [state.sql]);

  async function importJSON(file: File) {
    const text = await file.text();

    try {
      const json = JSON.parse(text as string);
      const prompt = window.prompt("Enter a table name");
      if (!prompt) {
        throw new Error("Invalid table name");
      }
      const sqlCreateStatement = API.jsonToSQL(prompt, json);

      await executeQuery(sqlCreateStatement);
    } catch (err) {
      console.error(err);
      window.alert("Invalid JSON file");
    } finally {
      setState({
        ...state,
        json: null,
      });
    }
  }

  async function importCSV(file: File) {
    try {
      const text = await file.text();

      const prompt = window.prompt("Enter a table name");
      if (!prompt) {
        throw new Error("Invalid table name");
      }
      const sqlCreateStatement = API.csvToSQL(prompt, text);
      await executeQuery(sqlCreateStatement);
    } catch (err) {
      console.error(err);
      window.alert("Invalid CSV file");
    } finally {
      setState({
        ...state,
        csv: null,
      });
    }
  }

  function updateState(ev: ChangeEvent<HTMLInputElement>) {
    if (ev.target.files === null) {
      return;
    }

    setState({
      ...state,
      [ev.target.name]: ev.target.files[0],
    });
  }

  return (
    <div className="m-4">
      {/* import json from file */}
      <label>Import JSON from file</label>
      <input
        type="file"
        accept=".json"
        className="mb-4 mt-1 text-xs"
        name="json"
        onChange={updateState}
      />
      {/* import csv from file */}
      <label>Import CSV from file</label>
      <input
        type="file"
        accept=".csv"
        className="mb-4 mt-1 text-xs"
        name="csv"
        onChange={updateState}
      />
      {/* import sql from file */}
      <label>Import CSV from file</label>
      <input
        type="file"
        accept=".sql"
        className="mb-4 mt-1 text-xs"
        name="sql"
        onChange={updateState}
      />
    </div>
  );
}
