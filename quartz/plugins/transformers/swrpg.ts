import { QuartzTransformerPlugin } from "../types"
import * as yaml from "js-yaml"
import { visit } from "unist-util-visit"

export const SWRPG: QuartzTransformerPlugin = () => {
  return {
    name: "SWRPG",

    externalResources() {
      return {
        additionalHead: []
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

                const layout = String(data.layout ?? "")

                /*
                 * ============================================================
                 * CARD TYPES
                 * Add new card layouts here as they are created.
                 * ============================================================
                 */

                const cardImages: Record<string, string> = {
                  weapon: "/static/weapon-card.png",
                  attachment: "/static/attachment-card.png",

                  // Future cards:
                  // armor: "/static/armor-card.png",
                  // gear: "/static/gear-card.png",
                  // vehicle: "/static/vehicle-card.png",
                }

                if (!cardImages[layout]) {
                  return
                }

                /*
                 * ============================================================
                 * HELPER FUNCTIONS
                 * ============================================================
                 */

                const esc = (value: unknown) =>
                  String(value ?? "—")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")

                /*
                 * ============================================================
                 * WEAPON CARD
                 * ============================================================
                 */

                if (layout === "weapon") {
                  node.type = "html"
                  node.value = `
                    <div class="swrpg-card weapon-card">
                      <img src="${cardImages.weapon}">

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

                  return
                }

                /*
                 * ============================================================
                 * ATTACHMENT CARD
                 * ============================================================
                 *
                 * Add the attachment-specific fields and assets here.
                 */

                if (layout === "attachment") {
                  node.type = "html"
                  node.value = `
                    <div class="swrpg-card attachment-card">
                      <img src="${cardImages.attachment}">

                      <div class="attachment-encumbrance">${esc(data.encumbrance)}</div>
                      <div class="attachment-price">${esc(data.price)}</div>
                      <div class="attachment-rarity">${esc(data.rarity)}</div>
					  <div class="attachment-hp">${esc(data.hp)}</div>

                    </div>
                  `

                  return
                }

                /*
                 * ============================================================
                 * FUTURE CARD TYPES
                 * ============================================================
                 *
                 * if (layout === "armor") {
                 *   ...
                 * }
                 *
                 * if (layout === "gear") {
                 *   ...
                 * }
                 *
                 * if (layout === "vehicle") {
                 *   ...
                 * }
                 */
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