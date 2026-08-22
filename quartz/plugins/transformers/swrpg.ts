import { QuartzTransformerPlugin } from "../types"
import * as yaml from "js-yaml"
import { visit } from "unist-util-visit"

export const SWRPG: QuartzTransformerPlugin = () => {
  return {
    name: "SWRPG",

    externalResources() {
      return {
        additionalHead: [
          {
            tagName: "link",
            attributes: {
              rel: "stylesheet",
              href: "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap",
            },
          },
        ],
      }
    },

    markdownPlugins() {
      return [
        () => {
          return (tree) => {
            visit(tree, "code", (node) => {
              if (node.lang !== "swrpg" || typeof node.value !== "string") {
                return
              }

              try {
                const data = yaml.load(node.value) as Record<string, unknown>

                if (data.layout !== "weapon") {
                  return
                }

                const esc = (value: unknown) =>
                  String(value ?? "—")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")

                node.type = "html"
                node.value = `
                  <div class="weapon-card">
                    <img src="/static/weapon-card.png">

                    <div class="weapon-skill">${esc(data.skill)}</div>
                    <div class="weapon-range">${esc(data.range)}</div>
                    <div class="weapon-encumbrance">${esc(data.encumbrance)}</div>
                    <div class="weapon-price">${esc(data.price)}</div>
                    <div class="weapon-rarity">${esc(data.rarity)}</div>

                    <div class="weapon-damage">${esc(data.damage)}</div>
                    <div class="weapon-critical">${esc(data.critical)}</div>
                    <div class="weapon-hp">${esc(data.hp)}</div>

                    <div class="weapon-special">${esc(data.special)}</div>
                  </div>
                `
              } catch (error) {
                console.error("Failed to parse SWRPG asset:", error)
              }
            })
          }
        },
      ]
    },
  }
}