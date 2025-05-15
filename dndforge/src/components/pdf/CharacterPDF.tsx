'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

export function CharacterPDF({ character, notes }: any) {
    const styles = StyleSheet.create({
        page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
        title: { fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
        section: { marginBottom: 12 },
        label: { fontWeight: 'bold' },
        note: { marginBottom: 6, borderBottom: '1px solid #ccc', paddingBottom: 4 }
    })

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>{character.name}</Text>
                    <Text>{character.race} • {character.class}</Text>
                    <Text>Idade: {character.age} | Alinhamento: {character.alignment}</Text>
                </View>

                {character.avatar_url && (
                    <View style={{ marginBottom: 20 }}>
                        <Image
                            src={character.avatar_url}
                            style={{ width: 200, height: 200, objectFit: 'cover' }}
                        />
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.label}>Atributos:</Text>
                    {[
                        ['Força', character.strength],
                        ['Destreza', character.dexterity],
                        ['Constituição', character.constitution],
                        ['Inteligência', character.intelligence],
                        ['Sabedoria', character.wisdom],
                        ['Carisma', character.charisma],
                    ].map(([label, val]) => (
                        <Text key={label}>{label}: {val}</Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Notas:</Text>
                    {notes.length === 0 ? (
                        <Text>Nenhuma anotação ainda.</Text>
                    ) : (
                        notes.map((n: any, idx: number) => (
                            <Text key={n.id} style={styles.note}>{idx + 1}. {n.content}</Text>
                        ))
                    )}
                </View>
            </Page>
        </Document>
    )
}
