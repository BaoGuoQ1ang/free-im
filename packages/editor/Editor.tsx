import { defineComponent, ref } from "vue";
import { makeObjectProp } from '../utils'
import { Contact } from '../index'

const command = (command: string, val?: any) => {
    document.execCommand(command, false, val);
}

const editorProps = {
    contact: makeObjectProp<Contact>(),
}

export default defineComponent({
    name: 'free-editor',
    props: editorProps,
    emits: ['send'],
    setup(props, { emit }) {
        const textarea = ref<HTMLElement>()

        const onKeydown = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && !event.ctrlKey && !event.shiftKey) {
                event.preventDefault()
                command("insertLineBreak")
            }
            if (event.code === 'Enter') {
                
                
                if (event.ctrlKey) {
                    handleSend()
                }
                
            }
            
        }

        function handleSend() {
            console.log('发送')
            emit('send', textarea.value?.innerHTML)
            clear()
        }
        
        function clear() {
            textarea.value!.innerHTML = ''
        }

        const fileRef = ref<HTMLInputElement>()
        const files = ref<FileList | null>()
        const changeFile = () => {
            files.value = fileRef.value?.files
            console.log(fileRef.value?.files)
            show.value = true
        }

        const handleClickFile = () => {
            fileRef.value?.click()
        }

        const show = ref(false)

        const emojiClick = () => {
            show.value = true
        }

        const ok = () => {
            show.value = false
            files.value = null
        }

        return () => {
            return (
                <div class="free-editor">
                    <free-dialog v-model={[show.value, 'show']} width={260} header={false} onOk={ ok }>
                        <div class="free-editor-files">
                            <div class="free-editor-files__title">发送给：</div>
                            <div class="free-editor-files__info">
                                <free-avatar avatar={ props.contact.avatar }></free-avatar>
                                <div class="free-editor-files__nickname">{ props.contact.nickname }</div>
                            </div>
                            <div class="free-editor-files__content">
                                <div class="free-editor-files__list">
                                    {
                                        files.value ? Array.from(files.value).map(file => {
                                            return (
                                                <div class="free-editor-files__item">
                                                    <img src="" alt="" />
                                                    <div>
                                                        <div class="free-editor-filename">{ file.name }</div>
                                                        <div class="free-editor-filesize">{ file.size }</div>
                                                    </div>
                                                </div>
                                            )
                                        }) : []
                                    }
                                </div>
                                <div class="free-editor-files__footer">
                                    <input class="free-editor-files__input" type="text" placeholder="给朋友留言" />
                                </div>
                            </div>
                        </div>
                    </free-dialog>
                    <input type="file" ref={ fileRef } multiple style="display: none;" onChange={ changeFile } />
                    <div class="free-editor-tool">
                        <div class="free-editor-tool__item" onClick={ emojiClick }>
                            <i class="free-icon-emoji"></i>
                        </div>
                        <div class="free-editor-tool__item">
                            <i class="free-icon-file" onClick={ handleClickFile }></i>
                        </div>
                    </div>
                    <div class="free-editor-content">
                        <div
                            ref={ textarea }
                            class="free-editor-textarea"
                            contenteditable
                            spellcheck="false"
                            onKeydown={ onKeydown }
                        />
                    </div>
                    <div class="free-editor-footer">
                        <div class="free-editor-footer__inner">
                            <div class="free-editor-footer__text">ctrl + enter 快捷发送消息</div>
                            <free-button onClick={ handleSend }>发送</free-button>
                        </div>
                    </div>
                </div>
            )
        }
    }
})