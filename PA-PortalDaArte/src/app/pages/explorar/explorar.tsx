import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  PanResponder,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useTheme } from "../../../components/context/ThemeContext";

type Artist = {
  id: number;
  name: string;
  category: string;
  style: string;
  emoji: string;
  avatarColor: string;
  rating: number;
  reviews: number;
  price: number;
  distanceKm: number;
  favorite?: boolean;
};

const ARTISTS: Artist[] = [
  {
    id: 1,
    name: "Lucas Andrade",
    category: "Músicos",
    style: "Violão e Voz",
    emoji: "🎸",
    avatarColor: "#D1B48C",
    rating: 4.8,
    reviews: 96,
    price: 180,
    distanceKm: 4,
    favorite: false,
  },
  {
    id: 2,
    name: "Banda Vereda",
    category: "Bandas",
    style: "Forró",
    emoji: "🪗",
    avatarColor: "#8B5A2B",
    rating: 4.9,
    reviews: 210,
    price: 950,
    distanceKm: 8,
    favorite: true,
  },
  {
    id: 3,
    name: "DJ Marina",
    category: "Músicos",
    style: "Eletrônica",
    emoji: "🎧",
    avatarColor: "#4A3C31",
    rating: 4.7,
    reviews: 63,
    price: 650,
    distanceKm: 12,
    favorite: false,
  },
  {
    id: 4,
    name: "Trio Nordestino",
    category: "Bandas",
    style: "Forró Pé de Serra",
    emoji: "🥁",
    avatarColor: "#A0522D",
    rating: 4.8,
    reviews: 88,
    price: 700,
    distanceKm: 18,
    favorite: false,
  },
  {
    id: 5,
    name: "Juliana Diniz",
    category: "Músicos",
    style: "MPB",
    emoji: "🎤",
    avatarColor: "#CD853F",
    rating: 4.9,
    reviews: 128,
    price: 500,
    distanceKm: 6,
    favorite: false,
  },
  {
    id: 6,
    name: "Samba do Morro",
    category: "Bandas",
    style: "Samba",
    emoji: "🪘",
    avatarColor: "#556B2F",
    rating: 4.6,
    reviews: 44,
    price: 850,
    distanceKm: 25,
    favorite: false,
  },
  {
    id: 7,
    name: "Ana Beatriz",
    category: "Músicos",
    style: "Voz e Teclado",
    emoji: "🎹",
    avatarColor: "#9B7EDE",
    rating: 4.8,
    reviews: 72,
    price: 220,
    distanceKm: 10,
    favorite: false,
  },
  {
    id: 8,
    name: "Forró da Serra",
    category: "Bandas",
    style: "Forró",
    emoji: "🪗",
    avatarColor: "#C47A44",
    rating: 4.7,
    reviews: 115,
    price: 1100,
    distanceKm: 32,
    favorite: false,
  },
  {
    id: 9,
    name: "Rafael Lima",
    category: "Fotógrafos",
    style: "Eventos",
    emoji: "📷",
    avatarColor: "#64748B",
    rating: 4.9,
    reviews: 91,
    price: 300,
    distanceKm: 7,
    favorite: false,
  },
  {
    id: 10,
    name: "Ateliê Sol",
    category: "Pintores",
    style: "Arte contemporânea",
    emoji: "🎨",
    avatarColor: "#B96E75",
    rating: 4.6,
    reviews: 37,
    price: 420,
    distanceKm: 14,
    favorite: false,
  },
  {
    id: 11,
    name: "Movimento Livre",
    category: "Dançarinos",
    style: "Dança regional",
    emoji: "💃",
    avatarColor: "#D977A8",
    rating: 4.8,
    reviews: 55,
    price: 600,
    distanceKm: 21,
    favorite: false,
  },
  {
    id: 12,
    name: "Pedro Santos",
    category: "Músicos",
    style: "Saxofone",
    emoji: "🎷",
    avatarColor: "#475569",
    rating: 4.5,
    reviews: 31,
    price: 260,
    distanceKm: 9,
    favorite: false,
  },
  {
    id: 13,
    name: "Banda Mandacaru",
    category: "Bandas",
    style: "Xote",
    emoji: "🎻",
    avatarColor: "#A16207",
    rating: 4.9,
    reviews: 142,
    price: 1250,
    distanceKm: 42,
    favorite: false,
  },
  {
    id: 14,
    name: "Camila Rocha",
    category: "Fotógrafos",
    style: "Retratos",
    emoji: "📸",
    avatarColor: "#8B718B",
    rating: 4.7,
    reviews: 64,
    price: 280,
    distanceKm: 16,
    favorite: false,
  },
  {
    id: 15,
    name: "Cores do Agreste",
    category: "Pintores",
    style: "Pintura em tela",
    emoji: "🖌️",
    avatarColor: "#B45309",
    rating: 4.8,
    reviews: 28,
    price: 900,
    distanceKm: 48,
    favorite: false,
  },
  {
    id: 16,
    name: "Companhia Ginga",
    category: "Dançarinos",
    style: "Dança urbana",
    emoji: "🕺",
    avatarColor: "#7C3AED",
    rating: 4.7,
    reviews: 46,
    price: 450,
    distanceKm: 35,
    favorite: false,
  },
  {
    id: 17,
    name: "João do Acordeon",
    category: "Músicos",
    style: "Acordeon",
    emoji: "🪗",
    avatarColor: "#92400E",
    rating: 4.9,
    reviews: 173,
    price: 380,
    distanceKm: 5,
    favorite: false,
  },
  {
    id: 18,
    name: "Luz & Som",
    category: "Bandas",
    style: "Pop",
    emoji: "🎤",
    avatarColor: "#0F766E",
    rating: 4.5,
    reviews: 52,
    price: 1450,
    distanceKm: 55,
    favorite: false,
  },
  {
    id: 19,
    name: "Marina Alves",
    category: "Fotógrafos",
    style: "Casamentos",
    emoji: "📷",
    avatarColor: "#6B7280",
    rating: 4.9,
    reviews: 103,
    price: 750,
    distanceKm: 19,
    favorite: false,
  },
  {
    id: 20,
    name: "Estúdio Aurora",
    category: "Pintores",
    style: "Ilustração",
    emoji: "🌅",
    avatarColor: "#C2410C",
    rating: 4.6,
    reviews: 22,
    price: 350,
    distanceKm: 27,
    favorite: false,
  },
  {
    id: 21,
    name: "Passo a Passo",
    category: "Dançarinos",
    style: "Forró",
    emoji: "💃",
    avatarColor: "#BE185D",
    rating: 4.8,
    reviews: 61,
    price: 520,
    distanceKm: 11,
    favorite: false,
  },
  {
    id: 22,
    name: "Bruno Vieira",
    category: "Músicos",
    style: "Percussão",
    emoji: "🥁",
    avatarColor: "#57534E",
    rating: 4.4,
    reviews: 18,
    price: 200,
    distanceKm: 63,
    favorite: false,
  },
  {
    id: 23,
    name: "Banda Horizonte",
    category: "Bandas",
    style: "MPB",
    emoji: "🎶",
    avatarColor: "#0369A1",
    rating: 4.7,
    reviews: 97,
    price: 980,
    distanceKm: 74,
    favorite: false,
  },
  {
    id: 24,
    name: "Nina Costa",
    category: "Fotógrafos",
    style: "Shows",
    emoji: "📸",
    avatarColor: "#7C2D12",
    rating: 4.8,
    reviews: 49,
    price: 320,
    distanceKm: 29,
    favorite: false,
  },
  {
    id: 25,
    name: "Traço Vivo",
    category: "Pintores",
    style: "Muralismo",
    emoji: "🎨",
    avatarColor: "#166534",
    rating: 4.5,
    reviews: 19,
    price: 1200,
    distanceKm: 82,
    favorite: false,
  },
  {
    id: 26,
    name: "Corpo em Cena",
    category: "Dançarinos",
    style: "Dança contemporânea",
    emoji: "🩰",
    avatarColor: "#9D174D",
    rating: 4.9,
    reviews: 76,
    price: 800,
    distanceKm: 67,
    favorite: false,
  },
];

const SORT_OPTIONS = [
  { id: "rating", label: "Mais bem avaliados" },
  { id: "priceAsc", label: "Menor preço" },
  { id: "priceDesc", label: "Maior preço" },
  { id: "distance", label: "Mais próximos" },
];

const CATEGORY_OPTIONS = [
  "Todos os artistas",
  "Músicos",
  "Bandas",
  "Fotógrafos",
  "Pintores",
  "Dançarinos",
];
const RATING_OPTIONS = [5, 4, 3];
const DISTANCE_OPTIONS = [10, 25, 50, 100];

const MAX_SLIDER_VAL = 5000;
const TRACK_WIDTH = 225;

export default function ExplorarScreen() {
  const { theme, isLightMode } = useTheme();
  const styles = getStyles(theme) as any;
  const { width } = useWindowDimensions();
  const isMobile = width < 900; // Define se é tela de celular/tablet pequeno

  const [category, setCategory] = useState("Todos os artistas");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("5000");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [distance, setDistance] = useState(100);
  const [location, setLocation] = useState("Caruaru, PE");
  const [sort, setSort] = useState("rating");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const numericMin = Math.max(0, Number(minPrice.replace(/\D/g, "")) || 0);
  const numericMax = Math.min(
    MAX_SLIDER_VAL,
    Math.max(numericMin, Number(maxPrice.replace(/\D/g, "")) || MAX_SLIDER_VAL),
  );

  const minPercent = Math.min(
    100,
    Math.max(0, (numericMin / MAX_SLIDER_VAL) * 100),
  );
  const maxPercent = Math.min(
    100,
    Math.max(0, (numericMax / MAX_SLIDER_VAL) * 100),
  );

  const minPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const currentPx = (minPercent / 100) * TRACK_WIDTH;
        const newPx = Math.min(
          (maxPercent / 100) * TRACK_WIDTH,
          Math.max(0, currentPx + gestureState.dx),
        );
        const newVal = Math.round((newPx / TRACK_WIDTH) * MAX_SLIDER_VAL);
        setMinPrice(String(newVal));
      },
    }),
  ).current;

  const maxPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const currentPx = (maxPercent / 100) * TRACK_WIDTH;
        const newPx = Math.min(
          TRACK_WIDTH,
          Math.max(
            (minPercent / 100) * TRACK_WIDTH,
            currentPx + gestureState.dx,
          ),
        );
        const newVal = Math.round((newPx / TRACK_WIDTH) * MAX_SLIDER_VAL);
        setMaxPrice(String(newVal));
      },
    }),
  ).current;

  const filteredArtists = useMemo(() => {
    const result = ARTISTS.filter((artist) => {
      const matchesCategory =
        category === "Todos os artistas" || artist.category === category;
      const matchesPrice =
        artist.price >= numericMin && artist.price <= numericMax;
      const matchesRating = ratingFilter === 0 || artist.rating >= ratingFilter;
      const matchesDistance = artist.distanceKm <= distance;
      return (
        matchesCategory && matchesPrice && matchesRating && matchesDistance
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "priceAsc") return a.price - b.price;
      if (sort === "priceDesc") return b.price - a.price;
      if (sort === "distance") return a.distanceKm - b.distanceKm;
      return b.rating - a.rating || b.reviews - a.reviews;
    });
  }, [category, numericMin, numericMax, ratingFilter, distance, sort]);

  useEffect(() => {
    setVisibleCount(6);
  }, [
    category,
    numericMin,
    numericMax,
    ratingFilter,
    distance,
    sort,
    location,
  ]);

  const visibleArtists = filteredArtists.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArtists.length;

  const loadMore = () => {
    if (hasMore)
      setVisibleCount((current) =>
        Math.min(current + 6, filteredArtists.length),
      );
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) => ({ ...current, [id]: !current[id] }));
  };

  const clearFilters = () => {
    setCategory("Todos os artistas");
    setMinPrice("0");
    setMaxPrice("5000");
    setRatingFilter(0);
    setDistance(100);
    setLocation("Caruaru, PE");
    setSort("rating");
  };

  const formatPrice = (value: number) => `R$ ${value.toLocaleString("pt-BR")}`;

  const renderArtist = ({ item }: { item: Artist }) => {
    const isFavorite = favorites[item.id] ?? item.favorite ?? false;

    return (
      <View style={[styles.artistCard, isMobile && styles.artistCardMobile]}>
        <TouchableOpacity
          style={styles.cardHeart}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={isFavorite ? styles.heartIconActive : styles.heartIcon}>
            {isFavorite ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
        <View style={styles.avatarWrapper}>
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: item.avatarColor },
            ]}
          >
            <Text style={styles.avatarEmoji}>{item.emoji}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.style}</Text>
          </View>
        </View>
        <Text style={styles.artistName}>{item.name}</Text>
        <Text style={styles.artistRating}>
          ⭐{" "}
          <Text style={styles.ratingBold}>
            {item.rating.toFixed(1).replace(".", ",")}
          </Text>{" "}
          <Text style={styles.ratingCount}>({item.reviews})</Text>
        </Text>
        <Text style={styles.artistPrice}>{formatPrice(item.price)}/hora</Text>
        <Text style={styles.artistDistance}>📍 {item.distanceKm} km</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Ver perfil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFilterContent = () => (
    <View style={styles.filterScroll}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filtros</Text>
        <TouchableOpacity onPress={clearFilters}>
          <Text style={styles.clearFilters}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterBlock}>
        <View style={styles.filterBlockHeader}>
          <Text style={styles.filterSubTitle}>Categoria</Text>
          <Text style={styles.arrowIcon}>⌃</Text>
        </View>
        {CATEGORY_OPTIONS.map((option) => {
          const active = category === option;
          return (
            <TouchableOpacity
              key={option}
              style={styles.radioItem}
              onPress={() => setCategory(option)}
            >
              <Text style={active ? styles.radioActive : styles.radioInactive}>
                {active ? "◉" : "◯"}
              </Text>
              <Text
                style={active ? styles.filterLabelActive : styles.filterLabel}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.divider} />

      <View style={styles.filterBlock}>
        <View style={styles.filterBlockHeader}>
          <Text style={styles.filterSubTitle}>Preço por hora</Text>
          <Text style={styles.arrowIcon}>⌃</Text>
        </View>

        <View style={styles.sliderTrack}>
          <View
            style={[
              styles.sliderFill,
              { left: `${minPercent}%`, right: `${100 - maxPercent}%` },
            ]}
          />
          <View
            style={[styles.sliderThumbLeft, { left: `${minPercent}%` }]}
            {...minPanResponder.panHandlers}
          />
          <View
            style={[styles.sliderThumbRight, { left: `${maxPercent}%` }]}
            {...maxPanResponder.panHandlers}
          />
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>R$ 0</Text>
          <Text style={styles.priceText}>R$ 5.000</Text>
        </View>
        <View style={styles.priceInputs}>
          <View style={styles.priceInputBox}>
            <Text style={styles.inputPrefix}>Mín:</Text>
            <TextInput
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
              style={styles.priceInput}
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
          <View style={styles.priceInputBox}>
            <Text style={styles.inputPrefix}>Máx:</Text>
            <TextInput
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
              style={styles.priceInput}
              placeholder="5000"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.filterBlock}>
        <View style={styles.filterBlockHeader}>
          <Text style={styles.filterSubTitle}>Avaliação mínima</Text>
          <Text style={styles.arrowIcon}>⌃</Text>
        </View>
        {RATING_OPTIONS.map((option) => {
          const active = ratingFilter === option;
          const stars = "⭐".repeat(option) + "☆".repeat(5 - option);
          return (
            <TouchableOpacity
              key={option}
              style={styles.checkItem}
              onPress={() => setRatingFilter(active ? 0 : option)}
            >
              <Text
                style={active ? styles.checkboxActive : styles.checkboxInactive}
              >
                {active ? "☑" : "☐"}
              </Text>
              <Text
                style={active ? styles.filterLabelActive : styles.filterLabel}
              >
                {stars} {option}+ estrelas
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.divider} />

      <View style={styles.filterBlock}>
        <View style={styles.filterBlockHeader}>
          <Text style={styles.filterSubTitle}>Localização</Text>
          <Text style={styles.arrowIcon}>⌃</Text>
        </View>
        <View style={styles.locationInputBox}>
          <Text style={styles.locIcon}>📍</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            style={styles.locInput}
            placeholder="Cidade, UF"
            placeholderTextColor={theme.textSecondary}
          />
        </View>
        <Text style={styles.distanceLabel}>Distância máxima</Text>
        <View style={styles.pillsRow}>
          {DISTANCE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.pill, distance === option && styles.pillActive]}
              onPress={() => setDistance(option)}
            >
              <Text
                style={
                  distance === option ? styles.pillTextActive : styles.pillText
                }
              >
                {option} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isMobile && (
        <TouchableOpacity
          style={styles.applyFilterButton}
          onPress={() => setFilterModalVisible(false)}
        >
          <Text style={styles.applyFilterButtonText}>Ver Resultados</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isLightMode ? "dark-content" : "light-content"}
        backgroundColor={theme.headerBg || theme.mainBg}
      />

      <View style={styles.dashboardContainer}>
        {!isMobile && <Sidebar />}

        <View style={styles.rightArea}>
          <Header />

          <View style={styles.mainContent}>
            <View
              style={[styles.centerArea, isMobile && styles.centerAreaMobile]}
            >
              <View style={styles.pageHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.pageTitle}>Explorar Artistas</Text>
                  {isMobile && (
                    <TouchableOpacity
                      style={styles.mobileFilterBtn}
                      onPress={() => setFilterModalVisible(true)}
                    >
                      <Text style={styles.mobileFilterBtnText}>⚙️ Filtrar</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.pageSubHeader}>
                  <Text style={styles.resultCount}>
                    {filteredArtists.length}{" "}
                    <Text style={styles.resultCountNormal}>
                      artistas encontrados
                    </Text>
                  </Text>

                  <View style={styles.sortWrapper}>
                    <TouchableOpacity
                      style={styles.sortDropdown}
                      onPress={() => setSortOpen((value) => !value)}
                    >
                      <Text style={styles.sortText}>
                        Ordenar:{" "}
                        <Text style={styles.sortStrong}>
                          {
                            SORT_OPTIONS.find((option) => option.id === sort)
                              ?.label
                          }
                        </Text>{" "}
                        ▼
                      </Text>
                    </TouchableOpacity>
                    {sortOpen && (
                      <View style={styles.sortMenu}>
                        {SORT_OPTIONS.map((option) => (
                          <TouchableOpacity
                            key={option.id}
                            style={[
                              styles.sortOption,
                              sort === option.id && styles.sortOptionActive,
                            ]}
                            onPress={() => {
                              setSort(option.id);
                              setSortOpen(false);
                            }}
                          >
                            <Text
                              style={
                                sort === option.id
                                  ? styles.sortOptionTextActive
                                  : styles.sortOptionText
                              }
                            >
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <FlatList
                data={visibleArtists}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderArtist}
                numColumns={isMobile ? 1 : 3}
                key={isMobile ? "one-col" : "three-col"}
                columnWrapperStyle={!isMobile ? styles.gridRow : undefined}
                contentContainerStyle={styles.gridContainer}
                style={styles.gridScroll}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMore}
                onEndReachedThreshold={0.55}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>
                      Nenhum artista encontrado
                    </Text>
                    <Text style={styles.emptyText}>
                      Tente aumentar o preço, a distância ou limpar os filtros.
                    </Text>
                  </View>
                }
                ListFooterComponent={
                  <View style={styles.listFooter}>
                    {hasMore ? (
                      <Text style={styles.loadingText}>
                        Role para carregar mais artistas...
                      </Text>
                    ) : (
                      <Text style={styles.loadingText}>
                        Você chegou ao fim dos resultados.
                      </Text>
                    )}
                  </View>
                }
              />
            </View>

            {/* FILTRO LATERAL APENAS PARA DESKTOP/TELA GRANDE */}
            {!isMobile && (
              <View style={styles.filterSidebarContainer}>
                <View style={styles.filterSidebar}>
                  {renderFilterContent()}
                </View>
              </View>
            )}

            {/* MODAL DE FILTRO PARA MOBILE */}
            {isMobile && (
              <Modal
                visible={filterModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFilterModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {renderFilterContent()}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.mainBg },
    dashboardContainer: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: theme.mainBg,
    },
    rightArea: { flex: 1, flexDirection: "column", minWidth: 0 },
    mainContent: { flex: 1, flexDirection: "row", minHeight: 0, zIndex: 1 },
    centerArea: {
      flex: 1,
      padding: 32,
      minWidth: 0,
      minHeight: 0,
      overflow: "visible",
    },
    centerAreaMobile: { padding: 16 },
    pageHeader: { marginBottom: 20, zIndex: 9999, overflow: "visible" },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: "900",
      color: theme.textPrimary,
      fontFamily: "serif",
    },
    mobileFilterBtn: {
      backgroundColor: theme.cardBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
    },
    mobileFilterBtnText: {
      color: theme.textPrimary,
      fontWeight: "bold",
      fontSize: 13,
    },
    pageSubHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
      zIndex: 9999,
      overflow: "visible",
    },
    resultCount: { fontSize: 15, fontWeight: "bold", color: theme.textPrimary },
    resultCountNormal: { fontWeight: "normal", color: theme.textSecondary },

    sortWrapper: { position: "relative", zIndex: 99999, elevation: 9999 },
    sortDropdown: {
      backgroundColor: theme.cardBg,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    sortText: { color: theme.textSecondary, fontSize: 13 },
    sortStrong: { fontWeight: "bold", color: theme.textPrimary },
    sortMenu: {
      position: "absolute",
      top: 42,
      right: 0,
      width: 180,
      backgroundColor: theme.cardBg,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 12,
      paddingVertical: 6,
      zIndex: 999999,
      elevation: 50,
      ...Platform.select({
        web: { boxShadow: "0 10px 30px rgba(0,0,0,0.25)" },
      }),
    },
    sortOption: { paddingHorizontal: 14, paddingVertical: 10 },
    sortOptionActive: { backgroundColor: theme.menuActiveBg },
    sortOptionText: { color: theme.textSecondary, fontSize: 12 },
    sortOptionTextActive: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: "700",
    },
    gridScroll: { flex: 1, zIndex: 1 },
    gridContainer: { paddingBottom: 20, zIndex: 1 },
    gridRow: { justifyContent: "space-between", gap: 18, marginBottom: 18 },
    artistCard: {
      flex: 1,
      maxWidth: "32%",
      backgroundColor: theme.cardBg,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.borderColor,
      minHeight: 330,
      zIndex: 1,
    },
    artistCardMobile: {
      maxWidth: "100%",
      width: "100%",
      marginBottom: 16,
    },
    cardHeart: {
      position: "absolute",
      top: 16,
      right: 16,
      zIndex: 10,
      padding: 4,
    },
    heartIcon: { fontSize: 22, color: theme.textSecondary },
    heartIconActive: { fontSize: 22, color: theme.accent },
    avatarWrapper: { alignItems: "center", marginBottom: 12 },
    avatarPlaceholder: {
      width: 88,
      height: 88,
      borderRadius: 44,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    avatarEmoji: { fontSize: 40 },
    tag: {
      backgroundColor: theme.accent,
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 16,
      zIndex: 2,
      marginTop: -14,
      borderWidth: 2,
      borderColor: theme.cardBg,
    },
    tagText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
    artistName: {
      fontSize: 17,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 7,
      textAlign: "center",
    },
    artistRating: { fontSize: 13, color: theme.textSecondary, marginBottom: 5 },
    ratingBold: { color: theme.accent, fontWeight: "bold" },
    ratingCount: { color: theme.textSecondary },
    artistPrice: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 3,
    },
    artistDistance: {
      color: theme.textSecondary,
      fontSize: 12,
      marginBottom: 15,
    },
    profileButton: {
      backgroundColor: theme.accent,
      width: "100%",
      paddingVertical: 11,
      borderRadius: 30,
      alignItems: "center",
      marginTop: "auto",
    },
    profileButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
    listFooter: { alignItems: "center", paddingVertical: 16 },
    loadingText: { color: theme.textSecondary, fontSize: 13 },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 80,
      paddingHorizontal: 30,
    },
    emptyTitle: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: "800",
      marginBottom: 8,
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 14,
      textAlign: "center",
    },

    filterSidebarContainer: {
      width: 320,
      paddingVertical: 24,
      paddingRight: 24,
      backgroundColor: theme.mainBg,
      zIndex: 2,
    },
    filterSidebar: {
      flex: 1,
      backgroundColor: theme.cardBg,
      paddingHorizontal: 22,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderColor,
      overflow: "hidden",
      ...Platform.select({
        web: { boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
        default: { elevation: 4 },
      }),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      maxHeight: "85%",
    },
    applyFilterButton: {
      backgroundColor: theme.accent,
      borderRadius: 25,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
    },
    applyFilterButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
    filterScroll: { flex: 1 },
    filterHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingTop: 10,
    },
    filterTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: theme.textPrimary,
      fontFamily: "serif",
    },
    clearFilters: { color: theme.accent, fontWeight: "600", fontSize: 14 },
    filterBlock: { marginBottom: 18 },
    filterBlockHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    filterSubTitle: {
      fontSize: 15,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    arrowIcon: { color: theme.textSecondary, fontSize: 15 },
    radioItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    radioActive: { color: theme.accent, fontSize: 18, marginRight: 10 },
    radioInactive: { color: theme.borderColor, fontSize: 18, marginRight: 10 },
    checkItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    checkboxActive: { color: theme.accent, fontSize: 18, marginRight: 10 },
    checkboxInactive: {
      color: theme.borderColor,
      fontSize: 18,
      marginRight: 10,
    },
    filterLabel: { color: theme.textSecondary, fontSize: 13 },
    filterLabelActive: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: "600",
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderColor,
      marginVertical: 15,
    },
    sliderTrack: {
      height: 6,
      backgroundColor: theme.borderColor,
      borderRadius: 3,
      marginVertical: 14,
      position: "relative",
    },
    sliderFill: {
      position: "absolute",
      height: 6,
      backgroundColor: theme.accent,
      borderRadius: 3,
    },
    sliderThumbLeft: {
      position: "absolute",
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.accent,
      top: -8,
      marginLeft: -11,
      borderWidth: 3,
      borderColor: theme.cardBg,
      zIndex: 10,
    },
    sliderThumbRight: {
      position: "absolute",
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.accent,
      top: -8,
      marginLeft: -11,
      borderWidth: 3,
      borderColor: theme.cardBg,
      zIndex: 10,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    priceText: { color: theme.textSecondary, fontSize: 12 },
    priceInputs: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
    },
    priceInputBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 8,
      height: 38,
    },
    inputPrefix: { color: theme.textSecondary, fontSize: 11 },
    priceInput: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: 12,
      paddingVertical: 0,
      textAlign: "center",
      ...Platform.select({ web: { outlineStyle: "none" } }),
    },
    locationInputBox: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 10,
      paddingHorizontal: 10,
      height: 40,
      marginBottom: 12,
    },
    locIcon: { fontSize: 15, marginRight: 6 },
    locInput: {
      flex: 1,
      fontSize: 13,
      color: theme.textPrimary,
      ...Platform.select({ web: { outlineStyle: "none" } }),
    },
    distanceLabel: {
      color: theme.textSecondary,
      fontSize: 11,
      marginBottom: 8,
    },
    pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    pill: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 16,
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    pillActive: { backgroundColor: theme.accent, borderColor: theme.accent },
    pillText: { color: theme.textSecondary, fontSize: 11, fontWeight: "600" },
    pillTextActive: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  });
