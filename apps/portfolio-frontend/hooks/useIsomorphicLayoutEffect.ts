"use client"

import { useEffect, useLayoutEffect } from "react"

// Use useLayoutEffect in browser and useEffect on server
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect
