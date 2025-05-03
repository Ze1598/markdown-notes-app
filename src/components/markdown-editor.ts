// src/components/markdown-editor.ts
import { LitElement, html, css, customElement, property } from "lit";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { basicSetup } from "@codemirror/basic-setup"; // Note: Deprecated, use codemirror package directly in future

// Basic CodeMirror theme (replace or extend for custom styling)
const basicTheme = EditorView.baseTheme({
  "&": {
    height: "calc(100vh - 150px)", // Example height, adjust as needed
    border: "1px solid #ccc",
  },
  ".cm-scroller": { overflow: "auto" },
  ".cm-content": {
      fontFamily: "monospace",
      padding: "10px"
  }
});

@customElement("markdown-editor")
export class MarkdownEditor extends LitElement {
  @property({ type: String }) initialContent = "";

  private editorView?: EditorView;
  private debounceTimer?: number;

  firstUpdated() {
    // Ensure the target element is available
    const editorTarget = this.shadowRoot?.getElementById("codemirror-editor");
    if (editorTarget) {
      this.initializeCodeMirror(editorTarget);
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    // If the initialContent property changes externally (e.g., loading a new page),
    // update the editor content.
    if (changedProperties.has("initialContent") && this.editorView) {
        const currentDoc = this.editorView.state.doc.toString();
        if (currentDoc !== this.initialContent) {
            this.editorView.dispatch({
                changes: { from: 0, to: currentDoc.length, insert: this.initialContent || "" }
            });
        }
    }
  }

  initializeCodeMirror(targetElement: HTMLElement) {
    const state = EditorState.create({
      doc: this.initialContent,
      extensions: [
        // basicSetup includes line numbers, gutters, etc. Customize as needed.
        // basicSetup, // Using deprecated basic-setup for now
        // Minimal setup example:
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.handleDocChange(update.state.doc.toString());
          }
        }),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        basicTheme, // Apply basic styling
        // Add other extensions like syntax highlighting theme if desired
      ],
    });

    this.editorView = new EditorView({
      state,
      parent: targetElement,
    });
  }

  handleDocChange(content: string) {
    // Debounce emitting the change event
    clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent("content-change", {
          detail: { content },
          bubbles: true,
          composed: true,
        })
      );
    }, 500); // Debounce time: 500ms
  }

  // Expose a method to get current content if needed externally
  getContent(): string {
    return this.editorView?.state.doc.toString() || "";
  }

  // Expose a method to force save (could trigger parent save logic)
  forceSave() {
      // This might dispatch a specific event or call a parent method
      // For now, just log it
      console.log("Force save triggered in editor");
      // Immediately emit content change for parent to handle save
      this.dispatchEvent(
        new CustomEvent("content-change", {
          detail: { content: this.getContent() },
          bubbles: true,
          composed: true,
        })
      );
      // Optionally add a specific save event
      this.dispatchEvent(new CustomEvent("force-save", { bubbles: true, composed: true }));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.editorView?.destroy();
    clearTimeout(this.debounceTimer);
  }

  static styles = css`
    :host {
      display: block;
    }
    /* Container div style if needed */
    #codemirror-editor {
        /* Styles applied via basicTheme extension */
    }
  `;

  render() {
    return html`
      <div id="codemirror-editor"></div>
    `;
  }
}

