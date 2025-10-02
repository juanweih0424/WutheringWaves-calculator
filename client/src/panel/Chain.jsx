import React from 'react'
import { useState, useMemo } from "react";
import { useEffectiveStats } from "../hooks/useEffectiveStats";
import { useChain } from '../context/ChainContext';

export default function Chain() {
  const chain = useChain();
  return (
        <ul>
      {chain.map((node) => (
        <li key={node.id}>
          <strong>R{node.id}. {node.name}</strong>
          <p>{node.description}</p>
        </li>
      ))}
    </ul>
  )
}
