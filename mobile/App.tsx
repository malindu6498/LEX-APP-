import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  FolderOpen,
  House,
  MapPin,
  MessageCircle,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react-native';

const colors = {
  navy: '#071221',
  navySoft: '#0c1c33',
  gold: '#c4a35a',
  goldLight: '#d8bc76',
  paper: '#f5f3ed',
  white: '#ffffff',
  ink: '#13233d',
  muted: '#667181',
  border: 'rgba(19, 35, 61, 0.12)',
  paleGold: '#f4efe3',
};

type TabName = 'Home' | 'Documents' | 'Lawyers' | 'Profile';

const tabItems: { name: TabName; Icon: typeof House }[] = [
  { name: 'Home', Icon: House },
  { name: 'Documents', Icon: FileText },
  { name: 'Lawyers', Icon: Scale },
  { name: 'Profile', Icon: UserRound },
];

function SectionHeading({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDetail}>{detail}</Text>
    </View>
  );
}

function HomeScreen({ onOpenAssistant, onSelectTab }: { onOpenAssistant: () => void; onSelectTab: (tab: TabName) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <View style={styles.greetingRow}>
        <View style={styles.greetingCopy}>
          <Text style={styles.eyebrow}>YOUR LEX WORKSPACE</Text>
          <Text style={styles.pageTitle}>Legal support,{'\n'}made clearer.</Text>
          <Text style={styles.introText}>Get help with your next step, documents, and finding legal professionals.</Text>
        </View>
        <View style={styles.workspaceMark}>
          <ShieldCheck size={21} color={colors.gold} strokeWidth={1.8} />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onOpenAssistant}
        style={({ pressed }) => [styles.aiCard, pressed && styles.pressed]}
      >
        <View style={styles.aiCardIcon}>
          <Sparkles size={20} color={colors.goldLight} strokeWidth={1.8} />
        </View>
        <Text style={styles.aiEyebrow}>LEX AI SUPPORT</Text>
        <Text style={styles.aiTitle}>Not sure where to start?</Text>
        <Text style={styles.aiDescription}>
          Explore a legal question, understand common terms, and prepare to speak with a lawyer.
        </Text>
        <View style={styles.aiButton}>
          <Text style={styles.aiButtonText}>Try the assistant demo</Text>
          <ArrowRight size={17} color={colors.navy} />
        </View>
        <Text style={styles.aiDisclaimer}>Demo only · Not legal advice</Text>
      </Pressable>

      <SectionHeading title="What do you need today?" detail="Choose a place to get started." />
      <View style={styles.actionList}>
        <ActionCard
          Icon={FileText}
          title="Prepare a document"
          detail="Explore legal templates and document tools"
          onPress={() => onSelectTab('Documents')}
        />
        <ActionCard
          Icon={Scale}
          title="Find a lawyer"
          detail="Explore legal services and consultations"
          onPress={() => onSelectTab('Lawyers')}
        />
        <ActionCard
          Icon={MessageCircle}
          title="Community discussions"
          detail="Ask a general question or read discussions"
          onPress={() => Alert.alert('Community', 'Community discussions will be available when the LEX service is connected.')}
        />
      </View>

      <View style={styles.privacyNote}>
        <ShieldCheck size={17} color={colors.gold} />
        <Text style={styles.privacyText}>Keep personal and confidential details private in this demo.</Text>
      </View>
    </ScrollView>
  );
}

function ActionCard({
  Icon,
  title,
  detail,
  onPress,
}: {
  Icon: typeof House;
  title: string;
  detail: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
      <View style={styles.actionIcon}>
        <Icon size={20} color="#8a7040" strokeWidth={1.8} />
      </View>
      <View style={styles.actionCopy}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDetail}>{detail}</Text>
      </View>
      <ChevronRight size={19} color={colors.gold} />
    </Pressable>
  );
}

function DocumentsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.eyebrow}>YOUR LEGAL WORKSPACE</Text>
      <Text style={styles.pageTitle}>Documents</Text>
      <Text style={styles.introText}>Keep your legal paperwork organized and explore helpful tools.</Text>
      <View style={styles.documentFeature}>
        <View style={styles.featureIcon}>
          <Sparkles size={22} color={colors.gold} />
        </View>
        <Text style={styles.featureTitle}>Document tools</Text>
        <Text style={styles.featureText}>Explore templates and get ready to create or review a document.</Text>
        <Pressable style={styles.secondaryButton} onPress={() => Alert.alert('Document tools', 'Document tools are a preview and are not connected to a document service yet.')}>
          <Text style={styles.secondaryButtonText}>Explore tools</Text>
          <ArrowRight size={17} color={colors.navy} />
        </Pressable>
      </View>
      <View style={styles.simpleCard}>
        <FolderOpen size={22} color={colors.gold} />
        <View style={styles.simpleCardCopy}>
          <Text style={styles.actionTitle}>My documents</Text>
          <Text style={styles.actionDetail}>Your saved documents will appear here.</Text>
        </View>
      </View>
      <View style={styles.infoNotice}>
        <Text style={styles.infoNoticeText}>No documents are stored in this mobile preview yet.</Text>
      </View>
    </ScrollView>
  );
}

function LawyersScreen() {
  const [district, setDistrict] = useState('');
  const [query, setQuery] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.screenContent} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>LEGAL PROFESSIONALS</Text>
      <Text style={styles.pageTitle}>Find a lawyer</Text>
      <Text style={styles.introText}>Search by location or the kind of legal support you need.</Text>
      <View style={styles.searchBox}>
        <Search size={18} color={colors.muted} />
        <TextInput
          accessibilityLabel="Legal area"
          placeholder="Practice area or legal question"
          placeholderTextColor="#8993a0"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.searchBox}>
        <MapPin size={18} color={colors.gold} />
        <TextInput
          accessibilityLabel="District"
          placeholder="District (for example, Colombo)"
          placeholderTextColor="#8993a0"
          value={district}
          onChangeText={setDistrict}
          style={styles.searchInput}
        />
      </View>
      <Pressable
        style={styles.primaryButton}
        onPress={() => Alert.alert('Lawyer search', 'Lawyer listings will appear once the LEX directory service is connected.')}
      >
        <Search size={17} color={colors.navy} />
        <Text style={styles.primaryButtonText}>Search lawyers</Text>
      </Pressable>
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <BriefcaseBusiness size={23} color={colors.gold} />
        </View>
        <Text style={styles.emptyTitle}>Lawyer directory preview</Text>
        <Text style={styles.emptyText}>Verified lawyer listings and availability need a connected LEX service.</Text>
      </View>
    </ScrollView>
  );
}

function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>
      <Text style={styles.pageTitle}>Profile</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}><UserRound size={24} color={colors.navy} /></View>
        <View>
          <Text style={styles.actionTitle}>Client account</Text>
          <Text style={styles.actionDetail}>Mobile preview · No account connected</Text>
        </View>
      </View>
      <View style={styles.simpleCard}>
        <ShieldCheck size={20} color={colors.gold} />
        <View style={styles.simpleCardCopy}>
          <Text style={styles.actionTitle}>Privacy and security</Text>
          <Text style={styles.actionDetail}>Account security will be configured with authentication.</Text>
        </View>
      </View>
      <View style={styles.simpleCard}>
        <FileText size={20} color={colors.gold} />
        <View style={styles.simpleCardCopy}>
          <Text style={styles.actionTitle}>Plans and pricing</Text>
          <Text style={styles.actionDetail}>Plan details will be available in a later release.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function AssistantModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('');

  function sendQuestion() {
    if (!question.trim()) return;
    setAsked(question.trim());
    setQuestion('');
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.assistantScreen}>
        <View style={styles.assistantHeader}>
          <View style={styles.assistantBrand}>
            <View style={styles.assistantIcon}><Scale size={19} color={colors.goldLight} /></View>
            <View>
              <Text style={styles.assistantTitle}>LEX AI Support</Text>
              <Text style={styles.assistantStatus}>Assistant preview</Text>
            </View>
          </View>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close assistant" style={styles.closeButton}>
            <X size={21} color={colors.ink} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.chatMessages}>
          <View style={styles.botMessage}>
            <Text style={styles.botMessageText}>Welcome. I can help you explore general legal topics and prepare questions for a lawyer.</Text>
          </View>
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Please note</Text>
            <Text style={styles.noticeText}>This is an offline preview, not live AI or legal advice. Don’t enter confidential information.</Text>
          </View>
          {asked ? (
            <>
              <View style={styles.userMessage}><Text style={styles.userMessageText}>{asked}</Text></View>
              <View style={styles.botMessage}>
                <Text style={styles.botMessageText}>The assistant needs a secure LEX service before it can respond to legal questions. For advice about your situation, please speak with a qualified lawyer.</Text>
              </View>
            </>
          ) : null}
        </ScrollView>
        <View style={styles.chatComposer}>
          <TextInput
            accessibilityLabel="Message for LEX AI"
            placeholder="Ask a general question"
            placeholderTextColor="#8993a0"
            value={question}
            onChangeText={setQuestion}
            onSubmitEditing={sendQuestion}
            returnKeyType="send"
            style={styles.chatInput}
          />
          <Pressable onPress={sendQuestion} accessibilityRole="button" accessibilityLabel="Send question" style={styles.sendButton}>
            <Send size={18} color={colors.navy} />
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function App() {
  const [selectedTab, setSelectedTab] = useState<TabName>('Home');
  const [assistantVisible, setAssistantVisible] = useState(false);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <View style={styles.brandLockup}>
          <View style={styles.brandMark}><Scale size={20} color={colors.goldLight} strokeWidth={1.8} /></View>
          <Text style={styles.brandName}>LEX</Text>
        </View>
        <Pressable style={styles.notificationButton} accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => Alert.alert('Notifications', 'You’re all caught up.')}>
          <Bell size={19} color={colors.ink} strokeWidth={1.8} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {selectedTab === 'Home' ? <HomeScreen onOpenAssistant={() => setAssistantVisible(true)} onSelectTab={setSelectedTab} /> : null}
        {selectedTab === 'Documents' ? <DocumentsScreen /> : null}
        {selectedTab === 'Lawyers' ? <LawyersScreen /> : null}
        {selectedTab === 'Profile' ? <ProfileScreen /> : null}
      </View>

      <View style={styles.tabBar}>
        {tabItems.map(({ name, Icon }) => {
          const isSelected = selectedTab === name;
          return (
            <Pressable
              key={name}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelectedTab(name)}
              style={styles.tabItem}
            >
              <View style={[styles.tabIconWrap, isSelected && styles.tabIconWrapSelected]}>
                <Icon size={20} color={isSelected ? colors.navy : colors.muted} strokeWidth={isSelected ? 2 : 1.7} />
              </View>
              <Text style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}>{name}</Text>
            </Pressable>
          );
        })}
      </View>

      <AssistantModal visible={assistantVisible} onClose={() => setAssistantVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.paper },
  topBar: {
    height: 62,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
  },
  brandName: { color: colors.navy, fontSize: 19, fontWeight: '800', letterSpacing: 2.1 },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  notificationDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    top: 8,
    right: 9,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.gold,
  },
  content: { flex: 1 },
  screenContent: { paddingHorizontal: 20, paddingTop: 26, paddingBottom: 28 },
  greetingRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 22 },
  greetingCopy: { flex: 1 },
  eyebrow: { marginBottom: 8, color: '#8a7040', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  pageTitle: { color: colors.ink, fontSize: 32, lineHeight: 36, fontWeight: '700', letterSpacing: -0.7 },
  introText: { marginTop: 9, color: colors.muted, fontSize: 14, lineHeight: 20 },
  workspaceMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiCard: {
    overflow: 'hidden',
    padding: 22,
    borderRadius: 18,
    backgroundColor: colors.navy,
    marginBottom: 29,
  },
  aiCardIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216, 188, 118, 0.13)',
    marginBottom: 16,
  },
  aiEyebrow: { marginBottom: 7, color: colors.goldLight, fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  aiTitle: { color: colors.white, fontSize: 23, fontWeight: '700', letterSpacing: -0.3 },
  aiDescription: { marginTop: 9, color: '#d7dfeb', fontSize: 13, lineHeight: 19 },
  aiButton: {
    alignSelf: 'flex-start',
    marginTop: 17,
    paddingHorizontal: 14,
    minHeight: 42,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.goldLight,
  },
  aiButtonText: { color: colors.navy, fontSize: 12, fontWeight: '800' },
  aiDisclaimer: { marginTop: 11, color: '#b8c3d2', fontSize: 10, lineHeight: 15 },
  sectionHeading: { marginBottom: 13 },
  sectionTitle: { color: colors.ink, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  sectionDetail: { marginTop: 4, color: colors.muted, fontSize: 12 },
  actionList: { gap: 10 },
  actionCard: {
    minHeight: 76,
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paleGold,
  },
  actionCopy: { flex: 1, gap: 3 },
  actionTitle: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  actionDetail: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 13,
    marginTop: 18,
    backgroundColor: '#eee9dc',
    borderRadius: 10,
  },
  privacyText: { flex: 1, color: colors.muted, fontSize: 11, lineHeight: 16 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 5,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  tabItem: { minWidth: 65, alignItems: 'center', gap: 3, paddingHorizontal: 5 },
  tabIconWrap: { width: 42, height: 29, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  tabIconWrapSelected: { backgroundColor: colors.paleGold },
  tabLabel: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  tabLabelSelected: { color: colors.ink, fontWeight: '800' },
  documentFeature: { marginTop: 24, padding: 20, borderRadius: 16, backgroundColor: colors.navy },
  featureIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(216, 188, 118, 0.14)' },
  featureTitle: { marginTop: 16, color: colors.white, fontSize: 19, fontWeight: '700' },
  featureText: { marginTop: 7, color: '#d7dfeb', fontSize: 13, lineHeight: 19 },
  secondaryButton: { alignSelf: 'flex-start', marginTop: 17, paddingHorizontal: 14, minHeight: 40, borderRadius: 8, backgroundColor: colors.goldLight, flexDirection: 'row', alignItems: 'center', gap: 10 },
  secondaryButtonText: { color: colors.navy, fontSize: 12, fontWeight: '800' },
  simpleCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 13, padding: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  simpleCardCopy: { flex: 1, gap: 4 },
  infoNotice: { marginTop: 15, padding: 14, borderRadius: 10, backgroundColor: '#eee9dc' },
  infoNoticeText: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 49, paddingHorizontal: 13, marginTop: 13, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 13, paddingVertical: 12 },
  primaryButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9, height: 46, marginTop: 14, borderRadius: 9, backgroundColor: colors.goldLight },
  primaryButtonText: { color: colors.navy, fontWeight: '800', fontSize: 13 },
  emptyState: { alignItems: 'center', padding: 24, marginTop: 22, borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.white },
  emptyIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: colors.paleGold, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginTop: 13, color: colors.ink, fontSize: 15, fontWeight: '700' },
  emptyText: { marginTop: 6, color: colors.muted, textAlign: 'center', fontSize: 12, lineHeight: 17 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 20, padding: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 14 },
  profileAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.goldLight, alignItems: 'center', justifyContent: 'center' },
  assistantScreen: { flex: 1, backgroundColor: colors.paper },
  assistantHeader: { minHeight: 66, paddingHorizontal: 19, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  assistantBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  assistantIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  assistantTitle: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  assistantStatus: { marginTop: 2, color: colors.muted, fontSize: 10 },
  closeButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  chatMessages: { flexGrow: 1, padding: 18, gap: 12 },
  botMessage: { alignSelf: 'flex-start', maxWidth: '88%', padding: 14, borderRadius: 14, borderBottomLeftRadius: 4, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  botMessageText: { color: colors.ink, fontSize: 13, lineHeight: 19 },
  noticeCard: { padding: 13, borderRadius: 11, backgroundColor: '#eee9dc' },
  noticeTitle: { marginBottom: 4, color: '#806738', fontSize: 11, fontWeight: '800' },
  noticeText: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  userMessage: { alignSelf: 'flex-end', maxWidth: '88%', padding: 13, borderRadius: 14, borderBottomRightRadius: 4, backgroundColor: colors.navy },
  userMessageText: { color: colors.white, fontSize: 13, lineHeight: 18 },
  chatComposer: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 13, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  chatInput: { flex: 1, minHeight: 43, paddingHorizontal: 13, borderWidth: 1, borderColor: colors.border, borderRadius: 9, color: colors.ink, fontSize: 13 },
  sendButton: { width: 43, height: 43, borderRadius: 10, backgroundColor: colors.goldLight, alignItems: 'center', justifyContent: 'center' },
});
