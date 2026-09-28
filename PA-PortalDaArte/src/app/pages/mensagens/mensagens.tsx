import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import {
  Music,
  Headphones,
  Mic,
  Camera,
  Send,
  X,
  Play,
  MoreHorizontal,
  Info,
  Trash2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';

// Importações dos Componentes e do Contexto
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import { useTheme } from '../../../components/context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// 1) DADOS FIXOS
// ---------------------------------------------------------------------------

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Juliana Diniz',
    category: 'Cantora • MPB',
    lastMessage: 'Sobre a contratação',
    time: '19:30',
    unread: 2,
    icon: Mic,
    darkBgColor: '#1B3736',
    lightBgColor: '#E0F2F1',
    iconColor: '#20B2AA',
    status: 'Online agora',
  },
  {
    id: '2',
    name: 'Banda Vereda',
    category: 'Forró • 5 integrantes',
    lastMessage: 'Envio de proposta',
    time: 'Ontem',
    unread: 0,
    icon: Music,
    darkBgColor: '#412C1B',
    lightBgColor: '#FDE4D9',
    iconColor: '#E05A10',
    status: 'Offline',
  },
  {
    id: '3',
    name: 'Lucas Andrade',
    category: 'Violão e Voz',
    lastMessage: 'Disponibilidade',
    time: '12/08',
    unread: 0,
    icon: Music,
    darkBgColor: '#3D2218',
    lightBgColor: '#FDE4D9',
    iconColor: '#E05A10',
    status: 'Offline',
  },
  {
    id: '4',
    name: 'DJ Marina',
    category: 'Eletrônica • DJ Set',
    lastMessage: 'Obrigado!',
    time: '10/08',
    unread: 0,
    icon: Headphones,
    darkBgColor: '#2E2243',
    lightBgColor: '#EBE4FA',
    iconColor: '#8C52FF',
    status: 'Offline',
  },
];

type Mensagem = {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  mediaUri?: string | null;
  mediaType?: 'image' | 'video' | null;
};

const INITIAL_MESSAGES: Record<string, Mensagem[]> = { 
  '1': [ 
    { id: 'm1', fromMe: true, text: 'Olá Juliana, podemos confirmar sua contratação para um casamento?', time: '18:13' },
    { id: 'm2', fromMe: false, text: 'Olá Clara! está tudo pronto pra o show, pode fechar sim.', time: '18:15' },
    { id: 'm3', fromMe: true, text: 'Perfeito! Já reservei a data de 24/08 aqui na minha agenda de apresentações.', time: '19:32' },
    { id: 'm4', fromMe: false, text: 'Apenas uma dúvida: o local já conta com equipamento de som ou eu devo incluir no orçamento?', time: '19:34' },
  ],
  '2': [
    { id: 'm1', fromMe: false, text: 'Enviei a proposta atualizada, dá uma olhada quando puder!', time: 'Ontem' },
  ],
  '3': [
    { id: 'm1', fromMe: false, text: 'Tenho disponibilidade sim, qual seria a data do evento?', time: '12/08' },
  ],
  '4': [
    { id: 'm1', fromMe: false, text: 'Obrigado pela contratação, foi um prazer tocar no seu evento!', time: '10/08' },
  ],
};

export default function MensagensScreen() {
  const { theme, isLightMode } = useTheme();
  const styles = getStyles(theme) as any;

  const [selectedId, setSelectedId] = useState(CONVERSATIONS[0].id);
  const [messageText, setMessageText] = useState('');
  const [messagesData, setMessagesData] = useState<Record<string, Mensagem[]>>(INITIAL_MESSAGES);
  const [midiaAnexada, setMidiaAnexada] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
  
  // Estados de visualização e menus de mensagens
  const [midiaVisualizacao, setMidiaVisualizacao] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [modalDadosMensagem, setModalDadosMensagem] = useState<Mensagem | null>(null);

  const LIMITE_CARACTERES = 500;

  const selectedConversation = CONVERSATIONS.find((c) => c.id === selectedId);
  const SelectedIcon = selectedConversation?.icon;
  const messages = messagesData[selectedId] || [];

  const totalUnread = CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);

  const handleSelecionarMidia = async () => {
    try {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      const libraryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPerm.status !== 'granted' || libraryPerm.status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a câmera e a galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const arquivo = result.assets[0];
        const tipoMidia = arquivo.type === 'video' ? 'video' : 'image';
        setMidiaAnexada({ uri: arquivo.uri, type: tipoMidia });
      }
    } catch (error) {
      console.error('Erro ao selecionar mídia:', error);
      Alert.alert('Erro', 'Não foi possível carregar o arquivo.');
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() && !midiaAnexada) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const novaMensagem: Mensagem = {
      id: String(Date.now()),
      fromMe: true,
      text: messageText.trim(),
      time: currentTime,
      mediaUri: midiaAnexada ? midiaAnexada.uri : null,
      mediaType: midiaAnexada ? midiaAnexada.type : null,
    };

    setMessagesData((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), novaMensagem],
    }));

    setMessageText('');
    setMidiaAnexada(null);
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web') {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  const handleDeleteMessage = (msgId: string, fromMe: boolean) => {
    if (!fromMe) {
      Alert.alert('Ação não permitida', 'Você só pode deletar as suas próprias mensagens.');
      return;
    }

    setMessagesData((prev) => ({
      ...prev,
      [selectedId]: (prev[selectedId] || []).filter((m) => m.id !== msgId),
    }));
    setActiveMenuMessageId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isLightMode ? 'dark-content' : 'light-content'}
        backgroundColor={theme.headerBg}
      />
      <View style={styles.dashboardContainer}>
        <Sidebar activeRoute="mensagens" />

        <View style={styles.mainContent}>
          <Header />

          <View style={styles.messagesLayout}>
            {/* ---------------------- COLUNA DA ESQUERDA ---------------------- */}
            <View style={styles.conversationsPanel}>
              <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Mensagens</Text>
                <Text style={styles.pageSubtitle}> 
                  Você tem {totalUnread} mensagens não lidas
                </Text>
              </View>

              <ScrollView
                style={styles.conversationsScroll}
                showsVerticalScrollIndicator={true}
              >
                {CONVERSATIONS.map((item) => {
                  const IconComponent = item.icon;
                  const avatarBg = isLightMode ? item.lightBgColor : item.darkBgColor;
                  const isActive = item.id === selectedId;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.conversationItem,
                        isActive && styles.conversationItemActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedId(item.id)}
                    >
                      <View style={[styles.avatarContainer, { backgroundColor: avatarBg }]}>
                        <IconComponent size={20} color={item.iconColor} />
                      </View>

                      <View style={styles.conversationDetails}>
                        <View style={styles.conversationTopRow}>
                          <Text style={styles.conversationName} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={styles.conversationTime}>{item.time}</Text>
                        </View>
                        <Text style={styles.conversationCategory} numberOfLines={1}>
                          {item.category}
                        </Text>
                        <View style={styles.conversationBottomRow}>
                          <Text style={styles.conversationLastMessage} numberOfLines={1}>
                            {item.lastMessage}
                          </Text>
                          {item.unread > 0 && (
                            <View style={styles.unreadBadge}>
                              <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ------------------------- PAINEL DO CHAT ------------------------ */}
            <View style={styles.chatPanel}>
              {selectedConversation && SelectedIcon && (
                <>
                  <View style={styles.chatHeader}>
                    <View style={styles.chatHeaderLeft}>
                      <View
                        style={[
                          styles.chatAvatar,
                          {
                            backgroundColor: isLightMode
                              ? selectedConversation.lightBgColor
                              : selectedConversation.darkBgColor,
                          },
                        ]}
                      >
                        <SelectedIcon
                          size={18}
                          color={selectedConversation.iconColor}
                        />
                      </View>
                      <View>
                        <Text style={styles.chatHeaderName}>{selectedConversation.name}</Text>
                        <View style={styles.statusRow}>
                          <View style={styles.statusDot} />
                          <Text style={styles.statusText}>{selectedConversation.status}</Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.btnConfirm} activeOpacity={0.85}>
                      <Text style={styles.btnConfirmText}>Confirmar Contratação</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    style={styles.messagesScroll}
                    contentContainerStyle={styles.messagesScrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {messages.map((msg) => {
                      const isHovered = hoveredMessageId === msg.id;
                      const isMenuOpen = activeMenuMessageId === msg.id;

                      return (
                        <View
                          key={msg.id}
                          style={[
                            styles.bubbleRow,
                            msg.fromMe ? styles.bubbleRowRight : styles.bubbleRowLeft,
                          ]}
                          {...(Platform.OS === 'web' ? {
                            onMouseEnter: () => setHoveredMessageId(msg.id),
                            onMouseLeave: () => {
                              if (!isMenuOpen) setHoveredMessageId(null);
                            },
                          } : {})}
                        >
                          <View
                            style={[
                              styles.bubble,
                              msg.fromMe ? styles.bubbleMine : styles.bubbleTheirs,
                            ]}
                          >
                            {/* Três pontinhos estilo WhatsApp */}
                            {(isHovered || isMenuOpen) && (
                              <TouchableOpacity
                                style={styles.whatsappOptionsButton}
                                onPress={() => setActiveMenuMessageId(isMenuOpen ? null : msg.id)}
                                activeOpacity={0.7}
                              >
                                <MoreHorizontal size={16} color={msg.fromMe ? '#FFFFFF' : theme.textSecondary} />
                              </TouchableOpacity>
                            )}

                            {/* Menu Dropdown elegante */}
                            {isMenuOpen && (
                              <View 
                                style={[
                                  styles.messageDropdownMenu,
                                  msg.fromMe ? styles.dropdownMenuRight : styles.dropdownMenuLeft,
                                ]}
                              >
                                <TouchableOpacity 
                                  style={styles.menuDropdownItem}
                                  onPress={() => {
                                    setModalDadosMensagem(msg);
                                    setActiveMenuMessageId(null);
                                  }}
                                >
                                  <Info size={14} color={theme.textPrimary} />
                                  <Text style={styles.menuDropdownText}>Dados da mensagem</Text>
                                </TouchableOpacity>

                                {msg.fromMe && (
                                  <TouchableOpacity 
                                    style={styles.menuDropdownItem}
                                    onPress={() => handleDeleteMessage(msg.id, msg.fromMe)}
                                  >
                                    <Trash2 size={14} color="#E05A10" />
                                    <Text style={[styles.menuDropdownText, { color: '#E05A10' }]}>Deletar mensagem</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}

                            {msg.mediaUri && (
                              <TouchableOpacity 
                                activeOpacity={0.9} 
                                onPress={() => setMidiaVisualizacao({ uri: msg.mediaUri!, type: msg.mediaType || 'image' })}
                                style={styles.mediaPreviewWrapper}
                              >
                                {msg.mediaType === 'video' ? (
                                  <View style={styles.videoThumbnailContainer}>
                                    <Video
                                      source={{ uri: msg.mediaUri }}
                                      style={styles.chatImageMessage}
                                      videoStyle={styles.exactVideoSize} // <-- CORRIGIDO: Força o vídeo a respeitar as dimensões da caixa sem zoom
                                      resizeMode={ResizeMode.CONTAIN}
                                      shouldPlay={false}
                                      isMuted={true}
                                      positionMillis={1000}
                                    />
                                    <View style={styles.playButtonOverlay}>
                                      <Play size={24} color="#FFF" />
                                    </View>
                                  </View>
                                ) : (
                                  <Image source={{ uri: msg.mediaUri }} style={styles.chatImageMessage} />
                                )}
                              </TouchableOpacity>
                            )}

                            {msg.text ? (
                              <Text
                                style={[
                                  msg.fromMe ? styles.bubbleTextMine : styles.bubbleTextTheirs,
                                  msg.mediaUri ? { marginTop: 6 } : {}
                                ]}
                              >
                                {msg.text}
                              </Text>
                            ) : null}
                          </View>
                          <Text style={styles.bubbleTime}>{msg.time}</Text>
                        </View>
                      );
                    })}
                  </ScrollView>

                  {midiaAnexada && (
                    <View style={styles.anexoAviso}>
                      <View style={styles.previewAnexoContainer}>
                        {midiaAnexada.type === 'video' ? (
                          <View style={styles.miniVideoBox}><Play size={16} color="#FFF" /></View>
                        ) : (
                          <Image source={{ uri: midiaAnexada.uri }} style={styles.miniImagePreview} />
                        )}
                        <Text style={styles.anexoAvisoTexto} numberOfLines={1}>Mídia pronta para envio</Text>
                      </View>
                      <TouchableOpacity onPress={() => setMidiaAnexada(null)}>
                        <X size={18} color="#E05A10" />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Escreva sua mensagem... (Enter envia / Shift+Enter quebra linha)"
                      placeholderTextColor={theme.textSecondary}
                      value={messageText}
                      onChangeText={setMessageText}
                      multiline={true}
                      numberOfLines={3}
                      maxLength={LIMITE_CARACTERES}
                      textAlignVertical="top"
                      onKeyPress={handleKeyPress}
                    />

                    <TouchableOpacity 
                      style={styles.cameraButton} 
                      activeOpacity={0.8}
                      onPress={handleSelecionarMidia}
                    >
                      <Camera size={18} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.sendButton} 
                      activeOpacity={0.85}
                      onPress={handleSendMessage}
                    >
                      <Send size={16} color="#f6f6f7" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {!selectedConversation && (
                <View style={styles.chatEmptyState}>
                  <Text style={styles.pageSubtitle}>Selecione uma conversa</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Modal para Visualizar e Reproduzir Imagem ou Vídeo em Tela Cheia */}
      <Modal visible={!!midiaVisualizacao} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton} 
            onPress={() => setMidiaVisualizacao(null)}
          >
            <X size={28} color="#FFF" />
          </TouchableOpacity>

          {midiaVisualizacao?.type === 'video' ? (
            <Video
              source={{ uri: midiaVisualizacao.uri }}
              style={styles.modalVideoFull}
              videoStyle={styles.modalExactVideoSize} // <-- CORRIGIDO: Impede o zoom no modo tela cheia
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={true}
            />
          ) : (
            midiaVisualizacao && (
              <Image 
                source={{ uri: midiaVisualizacao.uri }} 
                style={styles.modalImageFull} 
                resizeMode="contain" 
              />
            )
          )}
        </View>
      </Modal>

      {/* Modal de Dados da Mensagem */}
      <Modal visible={!!modalDadosMensagem} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.dadosModalContent}>
            <View style={styles.dadosModalHeader}>
              <Text style={styles.dadosModalTitle}>Dados da Mensagem</Text>
              <TouchableOpacity onPress={() => setModalDadosMensagem(null)}>
                <X size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.dadosModalBody}>
              <Text style={styles.dadosLabel}>Enviado por: <Text style={styles.dadosValue}>{modalDadosMensagem?.fromMe ? 'Você' : selectedConversation?.name}</Text></Text>
              <Text style={styles.dadosLabel}>Horário: <Text style={styles.dadosValue}>{modalDadosMensagem?.time}</Text></Text>
              <Text style={styles.dadosLabel}>Tipo de Conteúdo: <Text style={styles.dadosValue}>{modalDadosMensagem?.mediaType ? `Mídia (${modalDadosMensagem.mediaType})` : 'Apenas Texto'}</Text></Text>
              <Text style={styles.dadosLabel}>ID da Mensagem: <Text style={styles.dadosValue}>{modalDadosMensagem?.id}</Text></Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// 3) ESTILOS
// ---------------------------------------------------------------------------
const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBg,
      ...Platform.select({ web: { height: '100vh', overflow: 'hidden' } }),
    },
    dashboardContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: theme.mainBg,
      ...Platform.select({ web: { height: '100vh', overflow: 'hidden' } }),
    },
    mainContent: {
      flex: 1,
      backgroundColor: theme.mainBg,
      ...Platform.select({
        web: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
      }),
    },
    messagesLayout: {
      flex: 1,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    conversationsPanel: {
      width: 300,
      borderRightWidth: 1,
      borderRightColor: theme.borderColor,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    pageHeader: {
      marginBottom: 12,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    pageSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    conversationsScroll: {
      flex: 1,
    },
    conversationItem: {
      flexDirection: 'row',
      padding: 10,
      borderRadius: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    conversationItemActive: {
      backgroundColor: theme.cardBg,
      borderColor: theme.accent,
    },
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    conversationDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    conversationTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    conversationName: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textPrimary,
      flexShrink: 1,
    },
    conversationTime: {
      fontSize: 10,
      color: theme.textSecondary,
      marginLeft: 6,
    },
    conversationCategory: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 1,
    },
    conversationBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
    },
    conversationLastMessage: {
      fontSize: 11,
      color: theme.textSecondary,
      flex: 1,
    },
    unreadBadge: {
      backgroundColor: theme.accent,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
      marginLeft: 6,
    },
    unreadBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '700',
    },
    chatPanel: {
      flex: 1,
      flexDirection: 'column',
    },
    chatEmptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    chatHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    chatAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    chatHeaderName: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#2ECC71',
      marginRight: 4,
    },
    statusText: {
      fontSize: 11,
      color: theme.textSecondary,
    },
    btnConfirm: {
      backgroundColor: theme.accent,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    btnConfirmText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
    },
    messagesScroll: {
      flex: 1,
      paddingHorizontal: 24,
    },
    messagesScrollContent: {
      paddingVertical: 16,
    },
    bubbleRow: {
      marginBottom: 14,
      maxWidth: '75%',
    },
    bubbleRowLeft: {
      alignSelf: 'flex-start',
      alignItems: 'flex-start',
    },
    bubbleRowRight: {
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
    },
    bubble: {
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 12,
      paddingRight: 28,
      position: 'relative',
      ...Platform.select({
        web: {
          display: 'inline-flex',
          maxWidth: '100%',
          width: 'fit-content',
        },
      }),
    },
    bubbleTheirs: {
      backgroundColor: theme.cardBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderTopLeftRadius: 2,
    },
    bubbleMine: {
      backgroundColor: theme.backgroundColor,
      borderTopRightRadius: 2,
    },
    whatsappOptionsButton: {
      position: 'absolute',
      top: 6,
      right: 6,
      padding: 2,
      zIndex: 5,
    },
    messageDropdownMenu: {
      position: 'absolute',
      top: 26,
      backgroundColor: theme.cardBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingVertical: 4,
      width: 160,
      zIndex: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    dropdownMenuLeft: {
      left: 4,
    },
    dropdownMenuRight: {
      right: 4,
    },
    menuDropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    menuDropdownText: {
      fontSize: 12,
      color: theme.textPrimary,
      marginLeft: 8,
    },
    bubbleTextTheirs: {
      color: theme.textPrimary,
      fontSize: 13,
      lineHeight: 18,
      flexWrap: 'wrap',
      ...Platform.select({ web: { wordBreak: 'break-word' } }),
    },
    bubbleTextMine: {
      color: '#ffffffe7',
      fontSize: 13,
      lineHeight: 18,
      flexWrap: 'wrap',
      ...Platform.select({ web: { wordBreak: 'break-word' } }),
    },
    bubbleTime: {
      fontSize: 10,
      color: theme.textSecondary,
      marginTop: 4,
    },
    mediaPreviewWrapper: {
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 2,
    },
    chatImageMessage: {
      width: 220,
      height: 150,
      borderRadius: 8,
      resizeMode: 'cover',
    },
    exactVideoSize: {
      width: 220,
      height: 150,
      borderRadius: 8,
    },
    modalExactVideoSize: {
      width: SCREEN_WIDTH * 0.9,
      height: SCREEN_HEIGHT * 0.8,
    },
    videoThumbnailContainer: {
      width: 220,
      height: 150,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButtonOverlay: {
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderRadius: 20,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    anexoAviso: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: theme.cardBg,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
    },
    previewAnexoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    miniImagePreview: {
      width: 32,
      height: 32,
      borderRadius: 4,
      marginRight: 8,
    },
    miniVideoBox: {
      width: 32,
      height: 32,
      borderRadius: 4,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    anexoAvisoTexto: {
      fontSize: 12,
      color: theme.textPrimary,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
    },
    cameraButton: {
      padding: 8,
      marginLeft: 8,
    },
    textInput: {
      flex: 1,
      backgroundColor: theme.cardBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === 'web' ? 10 : 8,
      color: theme.textPrimary,
      fontSize: 13,
      maxHeight: 100,
    },
    sendButton: {
      backgroundColor: theme.sendBtnBg,
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.95)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCloseButton: {
      position: 'absolute',
      top: 40,
      right: 30,
      zIndex: 10,
      padding: 10,
    },
    modalImageFull: {
      width: SCREEN_WIDTH * 0.9,
      height: SCREEN_HEIGHT * 0.8,
    },
    modalVideoFull: {
      width: SCREEN_WIDTH * 0.9,
      height: SCREEN_HEIGHT * 0.8,
    },
    dadosModalContent: {
      width: 320,
      backgroundColor: theme.cardBg,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    dadosModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    dadosModalTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    dadosModalBody: {
      gap: 8,
    },
    dadosLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    dadosValue: {
      fontWeight: '600',
      color: theme.textPrimary,
    },
  } as any);