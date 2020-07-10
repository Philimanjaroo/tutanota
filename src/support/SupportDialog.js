//@flow


import {Dialog} from "../gui/base/Dialog"
import type {DialogHeaderBarAttrs} from "../gui/base/DialogHeaderBar"
import type {ButtonAttrs} from "../gui/base/ButtonN"
import {ButtonN, ButtonType} from "../gui/base/ButtonN"
import {lang} from "../misc/LanguageViewModel"
import type {TextFieldAttrs} from "../gui/base/TextFieldN"
import {TextFieldN} from "../gui/base/TextFieldN"
import m from "mithril"
import stream from "mithril/stream/stream.js"
import {assertMainOrNode} from "../api/Env"
import {faq} from "./FaqModel"
import {MailEditor} from "../mail/MailEditor"
import {Keys} from "../api/common/TutanotaConstants"

assertMainOrNode()

export function showSupportDialog() {

	const closeButton: ButtonAttrs = {
		label: "close_alt",
		type: ButtonType.Secondary,
		click: () => {
			searchValue("")
			faq.searchResult = []
			dialog.close()
		}
	}

	const contactSupport: ButtonAttrs = {
		label: "contactSupport_action",
		type: ButtonType.Secondary,
		click: () => {
			MailEditor.writeSupportMail(searchValue())
			dialog.close()
			faq.searchResult = []
		}
	}


	const header: DialogHeaderBarAttrs = {
		left: [closeButton],
		middle: () => lang.get("supportMenu_label")
	}

	const searchValue = stream("")

	const searchInputField: TextFieldAttrs = {
		label: () => lang.get("describeProblem_msg"),
		oninput: (value, inputElement) => {
			faq.search(searchValue().trim())
		},
		value: searchValue
	}

	const child: Component = {
		view: () => {
			return [
				m(".pt"),
				m(".h1 .text-center", lang.get("howCanWeHelp_title")),
				m(TextFieldN, searchInputField),
				m(".pt", faq.searchResult.map((value) => {
					return m(".pb.faq-items", [
						// we can trust the faq entry here because it is sanitized in update-translations.js from the website project
						// trust is required because the search results are marked with <mark> tag and the faq entries contain html elements.
						m(".b", m.trust(value.title)),
						m(".flex-start.ml-negative-bubble.flex-wrap", value.tags.split(",").filter((tag => tag
							!== "")).map(tag => m(".bubble.plr-button", m.trust(tag.trim())))),
						m(".list-header", m.trust(value.text))
					])
				})),
				searchValue().trim()
					? m(".pb", [
						m(".b", lang.get("noSolution_msg")),
						m(ButtonN, contactSupport),
					])
					: null
			]
		}
	}

	faq.init().then(() => {
		faq.getList()
	})

	const dialog = Dialog.largeDialog(
		header,
		child
	).addShortcut({
		key: Keys.ESC,
		exec: () => {dialog.close()},
		help: "close_alt"
	})
	dialog.show()
}